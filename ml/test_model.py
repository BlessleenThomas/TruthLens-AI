import joblib

model = joblib.load("models/model.pkl")
vectorizer = joblib.load("models/vectorizer.pkl")


def predict(text):

    text_vector = vectorizer.transform([text])

    prediction = model.predict(text_vector)[0]

    probabilities = model.predict_proba(text_vector)[0]

    confidence = max(probabilities)

    if prediction == 1:
        result = "Potentially Misleading"
    else:
        result = "Potentially Reliable"

    return result, confidence


while True:

    text = input("\nEnter news text (or type exit): ")

    if text.lower() == "exit":
        break

    result, confidence = predict(text)

    print("\nPrediction:", result)
    print("Model confidence:", f"{confidence * 100:.2f}%")