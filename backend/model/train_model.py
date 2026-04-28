from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "dataset" / "data.csv"
MODEL_DIR = PROJECT_ROOT / "model"


def train_model():
    """Train the logistic regression model on the current dataset."""
    df = pd.read_csv(DATA_PATH)

    # Preprocess: Encode Gender (M=1, F=0)
    le = LabelEncoder()
    df["gender_encoded"] = le.fit_transform(df["gender"].astype(str).str.upper().str.strip())

    # Features and Target
    X = df[["gender_encoded", "experience", "score"]]
    y = df["selected"]

    # Train Logistic Regression model
    model = LogisticRegression()
    model.fit(X, y)

    # Save model and label encoder
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_DIR / "model.pkl")
    joblib.dump(le, MODEL_DIR / "label_encoder.pkl")

    print("Model trained and saved successfully!")

if __name__ == "__main__":
    train_model()
