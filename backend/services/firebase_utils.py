import json
from datetime import datetime, timezone
from pathlib import Path

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parents[2]
LOCAL_STORAGE_PATH = PROJECT_ROOT / "backend" / "storage" / "predictions.json"

db = None


def init_firebase():
    """Initialize Firestore when credentials are available."""
    global db
    try:
        cred_path = PROJECT_ROOT / "serviceAccountKey.json"
        if cred_path.exists() and not firebase_admin._apps:
            cred = credentials.Certificate(str(cred_path))
            firebase_admin.initialize_app(cred)

        if firebase_admin._apps:
            db = firestore.client()
            print("Firebase initialized successfully.")
        else:
            print("Firebase credentials not found. Using local JSON persistence.")
    except Exception as error:
        print(f"Error initializing Firebase: {error}")


def _ensure_local_storage():
    LOCAL_STORAGE_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not LOCAL_STORAGE_PATH.exists():
        LOCAL_STORAGE_PATH.write_text("[]", encoding="utf-8")


def _read_local_predictions():
    _ensure_local_storage()
    return json.loads(LOCAL_STORAGE_PATH.read_text(encoding="utf-8"))


def _write_local_predictions(predictions):
    _ensure_local_storage()
    LOCAL_STORAGE_PATH.write_text(json.dumps(predictions, indent=2), encoding="utf-8")


def save_prediction(data):
    """Save predictions to Firestore when configured and always keep a local history."""
    record = {
        **data,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    predictions = _read_local_predictions()
    predictions.insert(0, record)
    _write_local_predictions(predictions)

    if db:
        try:
            db.collection("predictions").add(record)
        except Exception as error:
            print(f"Error saving to Firebase: {error}")


def get_predictions():
    """Return prediction history, preferring local storage for offline demos."""
    predictions = _read_local_predictions()
    if predictions:
        return predictions

    if db:
        try:
            docs = db.collection("predictions").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as error:
            print(f"Error reading from Firebase: {error}")

    return []


init_firebase()
