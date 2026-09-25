from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .predictor import predict_news
from .indicators import detect_indicators

app = FastAPI(
    title="TruthLens AI",
    description="AI-powered fake news detection backend",
    version="1.0.0"
)

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "message": "TruthLens AI Backend is running!",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(request: NewsRequest):

    text = request.text.strip()

    if not text:
        return {
            "success": False,
            "message": "Please provide news article text."
        }

    if len(text) < 20:
        return {
            "success": False,
            "message": "Please provide a longer news article."
        }

    # ML prediction
    result = predict_news(text)

    # Explainable indicators
    indicators = detect_indicators(text)

    return {
        "success": True,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "indicators": indicators
    }