from io import BytesIO

import numpy as np
import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from model_loader import load_model
from services.ai_service import get_ai_suggestions
from services.bias import get_bias_metrics, load_dataset, save_dataset
from services.explain import explain_decision
from services.firebase_utils import get_predictions, save_prediction
from model.train_model import train_model

router = APIRouter()

model, le = load_model()


def refresh_model():
    """Reload the trained model after a dataset upload."""
    global model, le
    model, le = load_model()


class PredictRequest(BaseModel):
    gender: str
    experience: int
    score: int


class PredictResponse(BaseModel):
    prediction: str
    bias: str
    explanation: str
    confidence: float
    ai_suggestion: str | None = None
    feature_importance: dict[str, float]
    bias_metrics: dict[str, float | str | bool]


class UploadResponse(BaseModel):
    message: str
    total_candidates: int
    bias: str
    disparity: float
    male_selection_rate: float
    female_selection_rate: float
    ai_suggestion: str


@router.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    try:
        normalized_gender = request.gender.upper().strip()
        gender_encoded = le.transform([normalized_gender])[0]
        features = np.array([[gender_encoded, request.experience, request.score]])

        prediction_idx = model.predict(features)[0]
        prediction_label = "Selected" if prediction_idx == 1 else "Rejected"
        probabilities = model.predict_proba(features)[0]
        confidence = float(max(probabilities))

        bias_metrics = get_bias_metrics()
        explanation, feature_importance = explain_decision(
            model,
            [gender_encoded, request.experience, request.score],
            prediction_idx,
        )

        dataset_summary = (
            "How to reduce bias in this dataset?\n"
            f"Male selection rate: {bias_metrics['male_rate']:.2%}\n"
            f"Female selection rate: {bias_metrics['female_rate']:.2%}\n"
            f"Disparity: {bias_metrics['disparity']:.2%}\n"
            f"Current bias flag: {bias_metrics['bias']}"
        )
        ai_suggestion = (
            get_ai_suggestions(dataset_summary)
            if bias_metrics["is_biased"]
            else "No significant bias detected in the current dataset."
        )

        save_prediction(
            {
                "gender": normalized_gender,
                "experience": request.experience,
                "score": request.score,
                "prediction": prediction_label,
                "bias": bias_metrics["bias"],
                "explanation": explanation,
                "confidence": round(confidence, 4),
                "feature_importance": feature_importance,
                "bias_metrics": bias_metrics,
            }
        )

        return PredictResponse(
            prediction=prediction_label,
            bias=bias_metrics["bias"],
            explanation=explanation,
            confidence=confidence,
            ai_suggestion=ai_suggestion,
            feature_importance=feature_importance,
            bias_metrics=bias_metrics,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.post("/upload-dataset", response_model=UploadResponse)
async def upload_dataset(file: UploadFile = File(...)):
    try:
        if not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Please upload a CSV file.")

        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))
        save_dataset(df)

        train_model()
        refresh_model()

        dataset = load_dataset()
        metrics = get_bias_metrics(dataset)
        dataset_preview = dataset.head(20).to_dict(orient="records")
        ai_suggestion = get_ai_suggestions(
            "How to reduce bias in this dataset?\n"
            f"Bias metrics: {metrics}\n"
            f"Dataset preview: {dataset_preview}"
        )

        return UploadResponse(
            message="Dataset uploaded and bias analysis completed successfully.",
            total_candidates=len(dataset),
            bias=metrics["bias"],
            disparity=float(metrics["disparity"]),
            male_selection_rate=float(metrics["male_rate"]),
            female_selection_rate=float(metrics["female_rate"]),
            ai_suggestion=ai_suggestion,
        )
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error)) from error


@router.get("/predictions")
async def list_predictions():
    return {"items": get_predictions()}
