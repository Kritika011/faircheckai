from pathlib import Path

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATASET_PATH = PROJECT_ROOT / "dataset" / "data.csv"
BIAS_THRESHOLD = 0.20
REQUIRED_COLUMNS = {"gender", "experience", "score", "selected"}


def load_dataset() -> pd.DataFrame:
    """Load the demo dataset and normalize core columns."""
    if not DATASET_PATH.exists():
        raise FileNotFoundError("Dataset file not found.")

    df = pd.read_csv(DATASET_PATH)
    missing_columns = REQUIRED_COLUMNS - set(df.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"Dataset is missing required columns: {missing}")

    normalized_df = df.copy()
    normalized_df["gender"] = normalized_df["gender"].astype(str).str.upper().str.strip()
    normalized_df["experience"] = pd.to_numeric(normalized_df["experience"], errors="coerce").fillna(0)
    normalized_df["score"] = pd.to_numeric(normalized_df["score"], errors="coerce").fillna(0)
    normalized_df["selected"] = pd.to_numeric(normalized_df["selected"], errors="coerce").fillna(0).astype(int)
    return normalized_df


def save_dataset(df: pd.DataFrame) -> None:
    """Persist an uploaded dataset in the expected CSV format."""
    missing_columns = REQUIRED_COLUMNS - set(df.columns)
    if missing_columns:
        missing = ", ".join(sorted(missing_columns))
        raise ValueError(f"Uploaded CSV is missing required columns: {missing}")

    normalized_df = df.copy()
    normalized_df["gender"] = normalized_df["gender"].astype(str).str.upper().str.strip()
    normalized_df["experience"] = pd.to_numeric(normalized_df["experience"], errors="coerce").fillna(0)
    normalized_df["score"] = pd.to_numeric(normalized_df["score"], errors="coerce").fillna(0)
    normalized_df["selected"] = pd.to_numeric(normalized_df["selected"], errors="coerce").fillna(0).astype(int)
    DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    normalized_df.to_csv(DATASET_PATH, index=False)


def get_bias_metrics(df: pd.DataFrame | None = None) -> dict:
    """Calculate selection rates and disparity across genders."""
    dataset = df if df is not None else load_dataset()
    stats = dataset.groupby("gender")["selected"].mean()

    male_rate = float(stats.get("M", 0.0))
    female_rate = float(stats.get("F", 0.0))
    disparity = abs(male_rate - female_rate)
    is_biased = disparity > BIAS_THRESHOLD

    return {
        "bias": "Yes" if is_biased else "No",
        "is_biased": is_biased,
        "male_rate": round(male_rate, 4),
        "female_rate": round(female_rate, 4),
        "disparity": round(disparity, 4),
        "threshold": BIAS_THRESHOLD,
    }


def check_bias() -> tuple[str, bool, float, float, float]:
    """Return the simple bias status used by the prediction endpoint."""
    metrics = get_bias_metrics()
    return (
        metrics["bias"],
        metrics["is_biased"],
        metrics["male_rate"],
        metrics["female_rate"],
        metrics["disparity"],
    )
