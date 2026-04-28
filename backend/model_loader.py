from pathlib import Path

import joblib

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "model" / "model.pkl"
LE_PATH = PROJECT_ROOT / "model" / "label_encoder.pkl"


def load_model():
    if not MODEL_PATH.exists() or not LE_PATH.exists():
        raise FileNotFoundError("Model files not found. Please run train_model.py first.")

    model = joblib.load(MODEL_PATH)
    le = joblib.load(LE_PATH)
    return model, le
