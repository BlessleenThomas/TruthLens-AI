import joblib

model = joblib.load("models/model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")


def predict_news(text):
    vector = vectorizer.transform([text])

    prediction = model.predict(vector)[0]
    probabilities = model.predict_proba(vector)[0]

    confidence = float(max(probabilities))

    if prediction == 1:
        label = "Potentially Misleading"
    else:
        label = "Potentially Reliable"

    return {
        "prediction": label,
        "confidence": round(confidence, 4)
    }