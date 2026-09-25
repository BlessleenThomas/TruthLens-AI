import re


def detect_indicators(text):
    indicators = []
    text_lower = text.lower()

    sensational_words = [
        "shocking",
        "unbelievable",
        "miracle",
        "secret",
        "explosive",
        "stunning",
        "outrageous",
        "you won't believe",
        "you will not believe",
        "breaking"
    ]

    found_sensational = [
        word for word in sensational_words
        if word in text_lower
    ]

    if found_sensational:
        indicators.append(
            "Sensational or emotionally charged wording detected"
        )

    words = text.split()

    if len(words) > 5:
        uppercase_words = [
            word for word in words
            if word.isupper() and len(word) > 2
        ]

        if len(uppercase_words) >= 3:
            indicators.append(
                "Excessive use of capital letters"
            )

    if text.count("!") >= 3:
        indicators.append(
            "Excessive use of exclamation marks"
        )

    certainty_words = [
        "definitely",
        "certainly",
        "guaranteed",
        "100% true",
        "always",
        "never",
        "proven",
        "must be true"
    ]

    if any(word in text_lower for word in certainty_words):
        indicators.append(
            "Strong certainty or absolute claims detected"
        )

    urgency_words = [
        "urgent",
        "act now",
        "share immediately",
        "share this",
        "don't wait",
        "before it's too late"
    ]

    if any(word in text_lower for word in urgency_words):
        indicators.append(
            "Urgency or pressure to share detected"
        )

    if text.count("?") >= 3:
        indicators.append(
            "Multiple rhetorical questions detected"
        )

    urls = re.findall(r"https?://\S+|www\.\S+", text)

    if urls:
        indicators.append(
            "External links detected - source verification recommended"
        )

    if not indicators:
        indicators.append(
            "No major linguistic warning indicators detected"
        )

    return indicators