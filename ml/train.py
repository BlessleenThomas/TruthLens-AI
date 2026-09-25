import os
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

import joblib


# Demo training data
data = {
    "text": [
        "The government announced a new education policy after a formal review.",
        "Scientists published a study about climate change in a scientific journal.",
        "The company reported its quarterly financial results to investors.",
        "The health department issued an official vaccination update.",
        "Researchers conducted experiments and published their findings.",
        "The university announced the results of its annual examination.",
        "The weather department issued an official cyclone warning.",
        "The central bank released its latest economic report.",
        "The hospital published an official health advisory.",
        "Officials confirmed the new transportation project after a public meeting.",

        "SHOCKING secret cure discovered that doctors don't want you to know!",
        "You won't believe what happened next! Share this immediately!",
        "BREAKING! Miracle medicine guarantees to cure every disease!",
        "Scientists are hiding this unbelievable discovery from the public!",
        "100% TRUE! This secret trick will make you rich overnight!",
        "URGENT! Share this before it's too late!",
        "This miracle treatment is guaranteed to work for everyone!",
        "You won't believe this shocking government secret!",
        "Viral message claims drinking this secret liquid cures all illnesses!",
        "BREAKING shocking news that nobody wants you to see!"
    ],
    "label": [
        "reliable",
        "reliable",
        "reliable",
        "reliable",
        "reliable",
        "reliable",
        "reliable",
        "reliable",
        "reliable",
        "reliable",

        "misleading",
        "misleading",
        "misleading",
        "misleading",
        "misleading",
        "misleading",
        "misleading",
        "misleading",
        "misleading",
        "misleading"
    ]
}


# Create DataFrame
df = pd.DataFrame(data)

print("Dataset loaded successfully!")
print("Total samples:", len(df))


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["label"],
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)


# Convert text into TF-IDF features
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english"
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


# Train Logistic Regression model
model = LogisticRegression()

model.fit(X_train_tfidf, y_train)


# Test model
predictions = model.predict(X_test_tfidf)

accuracy = accuracy_score(y_test, predictions)

print("Model trained successfully!")
print("Test accuracy:", round(accuracy, 2))


# Create models folder
models_dir = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models"
)

os.makedirs(models_dir, exist_ok=True)


# Save model
model_path = os.path.join(
    models_dir,
    "fake_news_model.pkl"
)

vectorizer_path = os.path.join(
    models_dir,
    "tfidf_vectorizer.pkl"
)

joblib.dump(model, model_path)
joblib.dump(vectorizer, vectorizer_path)


print("Model saved to:", model_path)
print("Vectorizer saved to:", vectorizer_path)
print("Training completed successfully!")