# 📰 TruthLens AI — AI-Powered Fake News Detection

## 📌 Problem Statement

Fake and misleading news can spread rapidly through digital platforms and social media. It can be difficult for users to identify whether a news article contains potentially misleading information.

**TruthLens AI** is an AI/ML-based system that analyzes user-provided news text and predicts whether the content is **potentially reliable or potentially misleading**. The system uses Natural Language Processing (NLP) and Machine Learning techniques to analyze textual patterns and provides a confidence score along with key indicators that contributed to the prediction.

The system is designed as an AI-assisted analysis tool and does not claim to establish the absolute truth of an article.

---

## 🏗️ Architecture / Flowchart

```text
                ┌──────────────────────┐
                │     User Input       │
                │  News Article/Text   │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  Text Preprocessing  │
                │  Cleaning &          │
                │  Normalization       │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Feature Extraction │
                │       TF-IDF         │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   ML Classification  │
                │ Logistic Regression  │
                └──────────┬───────────┘
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
        ┌────────────────┐   ┌────────────────┐
        │  Prediction    │   │   Confidence   │
        │ Reliable /     │   │     Score      │
        │ Misleading     │   │                │
        └────────┬───────┘   └───────┬────────┘
                 │                   │
                 └─────────┬─────────┘
                           ▼
                ┌──────────────────────┐
                │ Key Indicators &     │
                │ Explanation          │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │   Result Dashboard  │
                └──────────────────────┘
```

---

## 🛠️ Technical Stack

### Machine Learning & NLP

* Python
* Pandas
* NumPy
* Scikit-learn
* TF-IDF
* Logistic Regression
* Natural Language Processing (NLP)

### Backend

* FastAPI
* Uvicorn

### Frontend

* HTML5
* CSS3
* JavaScript
* Chart.js

### Development & Tools

* Git
* GitHub
* VS Code
* Postman

---

## 👥 Team Information

### Team Name

**Root Access**

### Team Members

1. **Arunagiri K**
2. **Blessleen Hannah T**
3. **Dharaneeshwaran J**
4. **Durgadharshini S**

### Institution

**Erode Sengunthar Engineering College**

### Department

**B.Tech Information Technology**
