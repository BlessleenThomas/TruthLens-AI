
/* =========================================================
   TRUTHLENS AI
   Frontend Controller
   ========================================================= */

/*
    HOW THIS FILE WORKS

    1. Reads the article from the textarea
    2. Counts characters
    3. Validates the input
    4. Shows an AI-style loading animation
    5. Currently uses DEMO prediction data
    6. Displays confidence and indicators
    7. Is ready to connect to the FastAPI backend

    BACKEND CONTRACT:

    POST /predict

    Request:
    {
        "text": "article text"
    }

    Response:
    {
        "prediction": "Potentially Misleading",
        "confidence": 0.87,
        "indicators": [
            "Sensational wording",
            "Strong certainty"
        ]
    }
*/


/* =========================================================
   CONFIGURATION
   ========================================================= */

// Change this when Member 2 gives you the backend URL.

const API_URL = "http://127.0.0.1:8000/predict";

// Set this to false when the backend is ready.

const DEMO_MODE = true;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

// Main input

const articleInput =
    document.getElementById("articleInput");


// Character counter

const charCount =
    document.getElementById("charCount");


// Status message below textarea

const inputStatus =
    document.getElementById("inputStatus");


// Buttons

const analyzeBtn =
    document.getElementById("analyzeBtn");


// Sections

const loadingSection =
    document.getElementById("loadingSection");

const resultSection =
    document.getElementById("resultSection");


// Loading progress

const loadingBar =
    document.getElementById("loadingBar");


// Result elements

const prediction =
    document.getElementById("prediction");

const resultSummary =
    document.getElementById("resultSummary");

const confidenceValue =
    document.getElementById("confidenceValue");

const confidenceFill =
    document.getElementById("confidenceFill");

const indicatorsList =
    document.getElementById("indicatorsList");


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

articleInput.addEventListener("input", function () {

    const length = articleInput.value.length;

    charCount.textContent = length.toLocaleString();


    // Change the input status depending on text length

    if (length === 0) {

        inputStatus.textContent =
            "Ready for analysis";

        inputStatus.style.color =
            "#596478";

    }

    else if (length < 50) {

        inputStatus.textContent =
            "Add more content for better analysis";

        inputStatus.style.color =
            "#ffc857";

    }

    else {

        inputStatus.textContent =
            "Content ready for analysis";

        inputStatus.style.color =
            "#42e6a4";

    }

});


/* =========================================================
   MAIN ANALYSIS FUNCTION
   ========================================================= */

async function analyzeArticle() {

    const text =
        articleInput.value.trim();


    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (text.length === 0) {

        showNotification(
            "Please paste a news article first."
        );

        articleInput.focus();

        return;
    }


    if (text.length < 30) {

        showNotification(
            "Please provide a longer piece of text for analysis."
        );

        articleInput.focus();

        return;
    }


    /* -----------------------------------------------------
       PREPARE UI
    ----------------------------------------------------- */

    hideElement(resultSection);

    showElement(loadingSection);

    disableAnalyzeButton();

    startLoadingAnimation();


    try {

        let result;


        /* -------------------------------------------------
           DEMO MODE
           
           Used during frontend development before
           the backend is connected.
        ------------------------------------------------- */

        if (DEMO_MODE) {

            result =
                await runDemoAnalysis(text);

        }


        /* -------------------------------------------------
           REAL BACKEND MODE
        ------------------------------------------------- */

        else {

            result =
                await analyzeWithBackend(text);

        }


        /* -------------------------------------------------
           DISPLAY RESULT
        ------------------------------------------------- */

        displayResult(result);

    }

    catch (error) {

        console.error(
            "Analysis error:",
            error
        );

        showNotification(
            "Unable to analyze the article. Please check the backend."
        );

    }

    finally {

        stopLoadingAnimation();

        hideElement(loadingSection);

        enableAnalyzeButton();

    }

}


/* =========================================================
   DEMO AI ANALYSIS
   ========================================================= */

/*
    IMPORTANT:

    This is NOT pretending to be a real ML model.

    It is only for frontend testing.

    Once Member 2's FastAPI backend is ready,
    set:

        DEMO_MODE = false

    Then the frontend will use the real model.
*/

async function runDemoAnalysis(text) {

    return new Promise(function (resolve) {

        setTimeout(function () {

            const lowerText =
                text.toLowerCase();


            /*
                Simple visual demo indicators.

                These are NOT a replacement for
                the actual machine-learning model.
            */

            const indicators = [];


            // Detect sensational language

            const sensationalWords = [
                "shocking",
                "unbelievable",
                "miracle",
                "breaking",
                "secret",
                "explosive",
                "amazing",
                "revolutionary",
                "you won't believe"
            ];


            const foundSensational =
                sensationalWords.some(
                    word => lowerText.includes(word)
                );


            if (foundSensational) {

                indicators.push(
                    "Sensational or emotionally charged wording"
                );

            }


            // Detect absolute language

            const absoluteWords = [
                "always",
                "never",
                "everyone",
                "nobody",
                "100%",
                "completely",
                "definitely",
                "guaranteed"
            ];


            const foundAbsolute =
                absoluteWords.some(
                    word => lowerText.includes(word)
                );


            if (foundAbsolute) {

                indicators.push(
                    "Absolute or highly certain language"
                );

            }


            // Detect excessive punctuation

            const exclamationCount =
                (text.match(/!/g) || []).length;


            if (exclamationCount >= 3) {

                indicators.push(
                    "Excessive use of exclamation marks"
                );

            }


            // Detect very short content

            if (text.length < 120) {

                indicators.push(
                    "Limited textual context available"
                );

            }


            // Default indicator

            if (indicators.length === 0) {

                indicators.push(
                    "No strong linguistic warning pattern detected"
                );

            }


            /*
                Demo confidence.

                This will be replaced by the ML model's
                actual confidence score.
            */

            let confidence = 0.72;

            let prediction =
                "Potentially Reliable";


            if (indicators.length >= 3) {

                confidence = 0.89;

                prediction =
                    "Potentially Misleading";

            }

            else if (indicators.length === 2) {

                confidence = 0.81;

                prediction =
                    "Potentially Misleading";

            }

            else if (indicators.length === 1) {

                confidence = 0.68;

                prediction =
                    "Potentially Reliable";

            }


            resolve({

                prediction:
                    prediction,

                confidence:
                    confidence,

                indicators:
                    indicators

            });

        }, 1800);

    });

}


/* =========================================================
   REAL BACKEND CONNECTION
   ========================================================= */

async function analyzeWithBackend(text) {

    const response =
        await fetch(
            API_URL,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    text: text
                })

            }
        );


    /*
        If FastAPI returns an error,
        stop here.
    */

    if (!response.ok) {

        throw new Error(
            `Backend returned ${response.status}`
        );

    }


    const data =
        await response.json();


    /*
        Normalize backend response.

        This makes the frontend tolerant
        of small differences in backend naming.
    */

    return {

        prediction:
            data.prediction ||
            "Unknown",

        confidence:
            Number(
                data.confidence ?? 0
            ),

        indicators:
            Array.isArray(data.indicators)
                ? data.indicators
                : []

    };

}


/* =========================================================
   DISPLAY RESULT
   ========================================================= */

function displayResult(result) {

    const resultPrediction =
        result.prediction;


    /*
        Convert confidence into percentage.

        Backend should normally return:

        0.87

        But if it sends:

        87

        this code also handles that.
    */

    let confidence =
        Number(result.confidence);


    if (confidence <= 1) {

        confidence =
            confidence * 100;

    }


    confidence =
        Math.max(
            0,
            Math.min(
                100,
                confidence
            )
        );


    const roundedConfidence =
        Math.round(confidence);


    /* -----------------------------------------------------
       UPDATE PREDICTION
    ----------------------------------------------------- */

    prediction.textContent =
        resultPrediction;


    /* -----------------------------------------------------
       UPDATE CONFIDENCE
    ----------------------------------------------------- */

    confidenceValue.textContent =
        `${roundedConfidence}%`;


    confidenceFill.style.width =
        `${roundedConfidence}%`;


    /* -----------------------------------------------------
       RESULT COLOR
    ----------------------------------------------------- */

    const isMisleading =
        resultPrediction
            .toLowerCase()
            .includes("misleading");


    if (isMisleading) {

        prediction.style.color =
            "#ff637d";

        confidenceValue.style.color =
            "#ff637d";

        confidenceFill.style.background =
            "linear-gradient(90deg, #ff637d, #ff8b6a)";

        resultSummary.textContent =
            "The model identified linguistic patterns that are associated with potentially misleading content.";

    }

    else {

        prediction.style.color =
            "#42e6a4";

        confidenceValue.style.color =
            "#42e6a4";

        confidenceFill.style.background =
            "linear-gradient(90deg, #42e6a4, #35d9ff)";

        resultSummary.textContent =
            "The model did not identify strong linguistic warning patterns in the submitted text.";

    }


    /* -----------------------------------------------------
       INDICATORS
    ----------------------------------------------------- */

    renderIndicators(
        result.indicators
    );


    /* -----------------------------------------------------
       SHOW RESULT
    ----------------------------------------------------- */

    showElement(resultSection);


    /*
        Smoothly scroll the user to the result.
    */

    setTimeout(function () {

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);

}


/* =========================================================
   RENDER INDICATORS
   ========================================================= */

function renderIndicators(indicators) {

    indicatorsList.innerHTML = "";


    if (
        !indicators ||
        indicators.length === 0
    ) {

        const item =
            createIndicator(
                "No specific indicators returned."
            );

        indicatorsList.appendChild(item);

        return;

    }


    indicators.forEach(
        function (indicator) {

            const item =
                createIndicator(
                    indicator
                );

            indicatorsList.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   CREATE INDICATOR ELEMENT
   ========================================================= */

function createIndicator(text) {

    const container =
        document.createElement("div");


    container.className =
        "indicator";


    const icon =
        document.createElement("span");


    icon.textContent =
        "⚠";


    const label =
        document.createElement("span");


    label.textContent =
        text;


    container.appendChild(icon);

    container.appendChild(label);


    return container;

}


/* =========================================================
   CLEAR ARTICLE
   ========================================================= */

function clearArticle() {

    articleInput.value = "";

    charCount.textContent = "0";

    inputStatus.textContent =
        "Ready for analysis";

    inputStatus.style.color =
        "#596478";


    hideElement(resultSection);

    hideElement(loadingSection);


    articleInput.focus();

}


/* =========================================================
   ANALYZE ANOTHER ARTICLE
   ========================================================= */

function analyzeAnother() {

    clearArticle();


    /*
        Scroll back to the input area.
    */

    setTimeout(function () {

        articleInput.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }, 100);

}


/* =========================================================
   LOADING ANIMATION
   ========================================================= */

let loadingInterval = null;

function startLoadingAnimation() {

    let progress = 0;


    loadingBar.style.width =
        "0%";


    loadingInterval =
        setInterval(function () {

            /*
                Slowly move the fake progress bar.
                It never reaches 100% until the
                actual analysis is complete.
            */

            progress +=
                Math.random() * 8;


            if (progress > 92) {

                progress = 92;

            }


            loadingBar.style.width =
                `${progress}%`;

        }, 180);

}


function stopLoadingAnimation() {

    if (loadingInterval) {

        clearInterval(
            loadingInterval
        );

        loadingInterval = null;

    }


    loadingBar.style.width =
        "100%";

}


/* =========================================================
   BUTTON STATE
   ========================================================= */

function disableAnalyzeButton() {

    analyzeBtn.disabled = true;

    analyzeBtn.style.opacity =
        "0.6";

    analyzeBtn.style.cursor =
        "wait";


    analyzeBtn.querySelector(
        ".button-icon"
    ).textContent = "◌";

}


function enableAnalyzeButton() {

    analyzeBtn.disabled = false;

    analyzeBtn.style.opacity =
        "1";

    analyzeBtn.style.cursor =
        "pointer";


    analyzeBtn.querySelector(
        ".button-icon"
    ).textContent = "◈";

}


/* =========================================================
   SHOW / HIDE HELPERS
   ========================================================= */

function showElement(element) {

    element.classList.remove(
        "hidden"
    );

}


function hideElement(element) {

    element.classList.add(
        "hidden"
    );

}


/* =========================================================
   SIMPLE NOTIFICATION
   ========================================================= */

function showNotification(message) {

    /*
        Create notification dynamically.
        We don't need another HTML element.
    */

    const notification =
        document.createElement("div");


    notification.textContent =
        message;


    notification.style.position =
        "fixed";

    notification.style.bottom =
        "25px";

    notification.style.left =
        "50%";

    notification.style.transform =
        "translateX(-50%)";


    notification.style.zIndex =
        "9999";


    notification.style.padding =
        "13px 20px";


    notification.style.border =
        "1px solid rgba(255,255,255,0.1)";


    notification.style.borderRadius =
        "10px";


    notification.style.background =
        "#151b2a";


    notification.style.color =
        "#ffffff";


    notification.style.fontSize =
        "12px";


    notification.style.boxShadow =
        "0 15px 40px rgba(0,0,0,0.4)";


    notification.style.opacity =
        "0";


    notification.style.transition =
        "opacity 0.25s";


    document.body.appendChild(
        notification
    );


    /*
        Trigger animation.
    */

    requestAnimationFrame(
        function () {

            notification.style.opacity =
                "1";

        }
    );


    /*
        Remove notification.
    */

    setTimeout(function () {

        notification.style.opacity =
            "0";


        setTimeout(function () {

            notification.remove();

        }, 300);

    }, 2500);

}


/* =========================================================
   KEYBOARD SHORTCUT
   ========================================================= */

/*
    Ctrl + Enter
    or
    Cmd + Enter

    starts the analysis.
*/

articleInput.addEventListener(
    "keydown",
    function (event) {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "Enter"
        ) {

            analyzeArticle();

        }

    }
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "TruthLens AI frontend initialized."
        );


        console.log(
            `Demo mode: ${DEMO_MODE}`
        );


        console.log(
            `Backend URL: ${API_URL}`
        );

    }
);
