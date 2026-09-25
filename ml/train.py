import os
import re
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

# -----------------------------
# CONFIG
# -----------------------------

FAKE_PATH = "data/Fake.csv"
TRUE_PATH = "data/True.csv"

MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)


# -----------------------------
# TEXT CLEANING
# -----------------------------

def clean_text(text):
    text = str(text)
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+", " ", text)

    # Remove HTML
    text = re.sub(r"<.*?>", " ", text)

    # Keep letters and numbers
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text


# -----------------------------
# LOAD DATA
# -----------------------------

print("Loading dataset...")

fake = pd.read_csv(FAKE_PATH)
real = pd.read_csv(TRUE_PATH)

print("Fake articles:", len(fake))
print("Real articles:", len(real))


# -----------------------------
# CREATE LABELS
# -----------------------------

fake["label"] = 1
real["label"] = 0

# Combine title + text
fake["content"] = (
    fake["title"].fillna("") + " " +
    fake["text"].fillna("")
)

real["content"] = (
    real["title"].fillna("") + " " +
    real["text"].fillna("")
)

data = pd.concat(
    [
        fake[["content", "label"]],
        real[["content", "label"]]
    ],
    ignore_index=True
)


# -----------------------------
# CLEAN
# -----------------------------

data["content"] = data["content"].apply(clean_text)

data = data.dropna()

data = data[data["content"].str.len() > 50]

# Remove duplicate articles
data = data.drop_duplicates(subset=["content"])

# Shuffle
data = data.sample(frac=1, random_state=42).reset_index(drop=True)

print("\nTotal articles:", len(data))
print(data["label"].value_counts())


# -----------------------------
# OPTIONAL: LIMIT DATASET
# Faster for hackathon
# -----------------------------

MAX_PER_CLASS = 10000

fake_data = data[data["label"] == 1].head(MAX_PER_CLASS)
real_data = data[data["label"] == 0].head(MAX_PER_CLASS)

data = pd.concat(
    [fake_data, real_data]
).sample(frac=1, random_state=42)

print("\nTraining samples:", len(data))


# -----------------------------
# TRAIN / TEST SPLIT
# -----------------------------

X = data["content"]
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining:", len(X_train))
print("Testing:", len(X_test))


# -----------------------------
# TF-IDF
# -----------------------------

print("\nCreating TF-IDF features...")

vectorizer = TfidfVectorizer(
    max_features=30000,
    ngram_range=(1, 2),
    min_df=2,
    max_df=0.95,
    sublinear_tf=True
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print("TF-IDF shape:", X_train_tfidf.shape)


# -----------------------------
# MODEL
# -----------------------------

print("\nTraining Logistic Regression...")

model = LogisticRegression(
    max_iter=1000,
    C=2.0
)

model.fit(X_train_tfidf, y_train)


# -----------------------------
# EVALUATION
# -----------------------------

print("\nEvaluating model...")

predictions = model.predict(X_test_tfidf)

accuracy = accuracy_score(y_test, predictions)
precision = precision_score(y_test, predictions)
recall = recall_score(y_test, predictions)
f1 = f1_score(y_test, predictions)

print("\n==============================")
print("MODEL PERFORMANCE")
print("==============================")

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")

print("\nClassification Report:")
print(classification_report(
    y_test,
    predictions,
    target_names=["Reliable", "Misleading"]
))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, predictions))


# -----------------------------
# SAVE MODEL
# -----------------------------

model_path = os.path.join(
    MODEL_DIR,
    "model.pkl"
)

vectorizer_path = os.path.join(
    MODEL_DIR,
    "vectorizer.pkl"
)

joblib.dump(model, model_path)
joblib.dump(vectorizer, vectorizer_path)

print("\n==============================")
print("MODEL SAVED")
print("==============================")

print(model_path)
print(vectorizer_path)