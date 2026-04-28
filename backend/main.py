from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import predict
from backend.services.bias import get_bias_metrics, load_dataset
from backend.services.firebase_utils import get_predictions

app = FastAPI(title="FairCheck AI API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(predict.router)

@app.get("/")
async def root():
    return {"message": "Welcome to FairCheck AI API", "status": "running"}

@app.get("/stats")
async def get_stats():
    """Return dashboard statistics for the current dataset and saved predictions."""
    df = load_dataset()
    metrics = get_bias_metrics(df)
    history = get_predictions()
    total_candidates = len(df)
    selection_rate = float(df["selected"].mean())

    return {
        "total_candidates": total_candidates,
        "selection_rate": round(selection_rate, 2),
        "male_selection_rate": round(metrics["male_rate"], 2),
        "female_selection_rate": round(metrics["female_rate"], 2),
        "disparity": round(metrics["disparity"], 2),
        "bias": metrics["bias"],
        "prediction_count": len(history),
        "chart_data": [
            {"name": "Male", "rate": round(metrics["male_rate"] * 100, 1)},
            {"name": "Female", "rate": round(metrics["female_rate"] * 100, 1)}
        ],
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
