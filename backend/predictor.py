import os
import re
import joblib

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "fake_news_model.pkl"
)

VECTORIZER_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "tfidf_vectorizer.pkl"
)

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    MODEL_LOADED = True
except Exception:
    model = None
    vectorizer = None
    MODEL_LOADED = False


def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def predict_news(text):
    cleaned_text = clean_text(text)

    if MODEL_LOADED:
        transformed_text = vectorizer.transform([cleaned_text])

        prediction = model.predict(transformed_text)[0]
        probabilities = model.predict_proba(transformed_text)[0]

        confidence = max(probabilities)

        prediction_string = str(prediction).lower()

        if prediction_string in [
            "fake",
            "false",
            "misleading",
            "1"
        ]:
            label = "Potentially Misleading"
        else:
            label = "Potentially Reliable"

        return {
            "prediction": label,
            "confidence": round(float(confidence), 2)
        }

    # Temporary fallback until ML model is trained
    misleading_words = [
        "shocking",
        "breaking",
        "miracle",
        "secret",
        "unbelievable",
        "100% true",
        "guaranteed",
        "you won't believe",
        "urgent",
        "viral"
    ]

    text_lower = text.lower()

    matched_words = [
        word for word in misleading_words
        if word in text_lower
    ]

    if len(matched_words) >= 2:
        return {
            "prediction": "Potentially Misleading",
            "confidence": 0.72
        }

    return {
        "prediction": "Potentially Reliable",
        "confidence": 0.65
    }