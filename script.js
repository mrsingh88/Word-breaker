// ============================================
// WORD BREAKER
// ============================================


// --------------------------------------------
// WORD LIST
// --------------------------------------------

// 5-letter words

const words5 = [

    "apple",
    "brave",
    "bread",
    "chair",
    "cloud",
    "dance",
    "dream",
    "eagle",
    "earth",
    "flame",
    "glass",
    "grape",
    "green",
    "heart",
    "house",
    "light",
    "money",
    "music",
    "ocean",
    "party",
    "peace",
    "phone",
    "plant",
    "queen",
    "quick",
    "river",
    "robot",
    "round",
    "school",
    "shine",
    "smart",
    "smile",
    "snake",
    "sound",
    "space",
    "sport",
    "storm",
    "table",
    "tiger",
    "train",
    "water",
    "world",
    "write",
    "young",
    "zebra",
    "brain",
    "break",
    "build",
    "carry",
    "catch",
    "clean",
    "clear",
    "close",
    "count",
    "cover",
    "daily",
    "early",
    "enjoy",
    "every",
    "field",
    "final",
    "first",
    "focus",
    "fresh",
    "front",
    "fruit",
    "great",
    "group",
    "happy",
    "horse",
    "image",
    "judge",
    "learn",
    "level",
    "lunch",
    "major",
    "match",
    "maybe",
    "model",
    "month",
    "night",
    "north",
    "offer",
    "order",
    "paper",
    "place",
    "point",
    "power",
    "price",
    "proud",
    "radio",
    "raise",
    "reach",
    "ready",
    "right",
    "river",
    "share",
    "short",
    "small",
    "start",
    "state",
    "story",
    "study",
    "teach",
    "thing",
    "think",
    "today",
    "touch",
    "trade",
    "trust",
    "under",
    "value",
    "voice",
    "watch",
    "white",
    "whole",
    "woman",
    "worry",
    "wrong"
];


// 6-letter words

const words6 = [

    "animal",
    "answer",
    "artist",
    "banana",
    "beauty",
    "better",
    "border",
    "bright",
    "button",
    "camera",
    "career",
    "change",
    "choice",
    "circle",
    "coffee",
    "common",
    "danger",
    "design",
    "doctor",
    "effect",
    "energy",
    "engine",
    "enough",
    "family",
    "father",
    "flower",
    "forest",
    "friend",
    "future",
    "garden",
    "golden",
    "growth",
    "happen",
    "health",
    "honest",
    "inside",
    "island",
    "jacket",
    "jungle",
    "little",
    "market",
    "master",
    "minute",
    "mother",
    "nature",
    "number",
    "office",
    "orange",
    "people",
    "planet",
    "player",
    "please",
    "pocket",
    "purple",
    "rabbit",
    "random",
    "reason",
    "result",
    "school",
    "secret",
    "simple",
    "silver",
    "sister",
    "smooth",
    "soccer",
    "source",
    "speech",
    "spring",
    "street",
    "strong",
    "summer",
    "system",
    "target",
    "teacher",
    "travel",
    "treaty",
    "useful",
    "valley",
    "winter",
    "wonder",
    "yellow",
    "zephyr",
    "almost",
    "always",
    "around",
    "before",
    "behind",
    "better",
    "broken",
    "called",
    "center",
    "chance",
    "choose",
    "coming",
    "create",
    "during",
    "either",
    "family",
    "follow",
    "ground",
    "having",
    "hidden",
    "impact",
    "important",
    "listen",
    "lovely",
    "memory",
    "moment",
    "moving",
    "normal",
    "notice",
    "parent",
    "perfect",
    "person",
    "problem",
    "public",
    "really",
    "school",
    "should",
    "single",
    "special",
    "spirit",
    "square",
    "success",
    "thanks",
    "though",
    "toward",
    "unique",
    "unless",
    "wanted",
    "wonder"
];


// --------------------------------------------
// HTML ELEMENTS
// --------------------------------------------

const gameBoard =
    document.getElementById("gameBoard");

const keyboard =
    document.getElementById("keyboard");

const wordLengthDisplay =
    document.getElementById("wordLength");

const chancesDisplay =
    document.getElementById("chances");

const message =
    document.getElementById("message");

const newGameBtn =
    document.getElementById("newGameBtn");

const gamesPlayedDisplay =
    document.getElementById("gamesPlayed");

const gamesWonDisplay =
    document.getElementById("gamesWon");

const winRateDisplay =
    document.getElementById("winRate");

const streakDisplay =
    document.getElementById("streak");


// --------------------------------------------
// GAME VARIABLES
// --------------------------------------------

let secretWord = "";

let wordLength = 5;

let maxAttempts = 5;

let currentAttempt = 0;

let currentGuess = "";

let gameOver = false;


// --------------------------------------------
// STATISTICS
// --------------------------------------------

let statistics = {

    played: 0,

    won: 0,

    streak: 0

};


// Load statistics

const savedStats =
    localStorage.getItem("wordBreakerStats");

if (savedStats) {

    try {

        statistics = JSON.parse(savedStats);

    } catch {

        statistics = {
            played: 0,
            won: 0,
            streak: 0
        };

    }

}


// --------------------------------------------
// START GAME
// --------------------------------------------

function startGame() {

    // Randomly choose 5 or 6 letters

    wordLength =
        Math.random() < 0.5 ? 5 : 6;


    maxAttempts = wordLength;


    // Select word list

    const list =
        wordLength === 5 ? words5 : words6;


    // Pick random secret word

    secretWord =
        list[Math.floor(Math.random() * list.length)];


    // Reset game

    currentAttempt = 0;

    currentGuess = "";

    gameOver = false;


    // Update UI

    wordLengthDisplay.textContent =
        wordLength;

    chancesDisplay.textContent =
        maxAttempts;

    message.textContent = "";


    // Build board

    createBoard();


    // Build keyboard

    createKeyboard();

}


// --------------------------------------------
// CREATE BOARD
// --------------------------------------------

function createBoard() {

    gameBoard.innerHTML = "";


    for (let row = 0; row < maxAttempts; row++) {

        const rowElement =
            document.createElement("div");

        rowElement.className =
            "guess-row";


        for (let column = 0;
             column < wordLength;
             column++) {

            const tile =
                document.createElement("div");

            tile.className =
                "tile";

            tile.dataset.row = row;

            tile.dataset.column = column;

            rowElement.appendChild(tile);

        }


        gameBoard.appendChild(rowElement);

    }

}


// --------------------------------------------
// CREATE KEYBOARD
// --------------------------------------------

function createKeyboard() {

    keyboard.innerHTML = "";


    const rows = [

        "QWERTYUIOP",

        "ASDFGHJKL",

        "ZXCVBNM"

    ];


    rows.forEach((row, index) => {

        for (const letter of row) {

            const button =
                document.createElement("button");

            button.className = "key";

            button.textContent = letter;

            button.dataset.letter =
                letter.toLowerCase();

            button.addEventListener(
                "click",
                () => addLetter(letter.toLowerCase())
            );

            keyboard.appendChild(button);

        }

    });


    // Backspace

    const backspace =
        document.createElement("button");

    backspace.className =
        "key wide";

    backspace.textContent =
        "⌫";

    backspace.addEventListener(
        "click",
        removeLetter
    );


    keyboard.appendChild(backspace);


    // Enter

    const enter =
        document.createElement("button");

    enter.className =
        "key wide";

    enter.textContent =
        "ENTER";

    enter.addEventListener(
        "click",
        submitGuess
    );


    keyboard.appendChild(enter);

}


// --------------------------------------------
// ADD LETTER
// --------------------------------------------

function addLetter(letter) {

    if (gameOver) return;


    if (currentGuess.length >= wordLength) {

        return;

    }


    currentGuess += letter;


    updateCurrentRow();

}


// --------------------------------------------
// REMOVE LETTER
// --------------------------------------------

function removeLetter() {

    if (gameOver) return;


    currentGuess =
        currentGuess.slice(0, -1);


    updateCurrentRow();

}


// --------------------------------------------
// UPDATE CURRENT ROW
// --------------------------------------------

function updateCurrentRow() {

    const row =
        gameBoard.children[currentAttempt];


    const tiles =
        row.children;


    for (
        let i = 0;
        i < wordLength;
        i++
    ) {

        tiles[i].textContent =
            currentGuess[i] || "";

        tiles[i].classList.toggle(
            "current",
            Boolean(currentGuess[i])
        );

    }

}


// --------------------------------------------
// SUBMIT GUESS
// --------------------------------------------

function submitGuess() {

    if (gameOver) return;


    if (currentGuess.length !== wordLength) {

        showMessage(
            `Enter exactly ${wordLength} letters.`
        );

        return;

    }


    const list =
        wordLength === 5
            ? words5
            : words6;


    // Check if word exists

    if (!list.includes(currentGuess)) {

        showMessage(
            "That's not in my word list."
        );

        return;

    }


    evaluateGuess();


    currentAttempt++;


    chancesDisplay.textContent =
        maxAttempts - currentAttempt;


    currentGuess = "";


    // Check win

    if (
        gameBoard.children[currentAttempt - 1]
            .querySelectorAll(".correct").length
        === wordLength
    ) {

        winGame();

        return;

    }


    // Check loss

    if (currentAttempt >= maxAttempts) {

        loseGame();

    }

}


// --------------------------------------------
// EVALUATE GUESS
// --------------------------------------------

function evaluateGuess() {

    const row =
        gameBoard.children[currentAttempt];


    const tiles =
        row.children;


    const answer =
        secretWord.split("");


    const guess =
        currentGuess.split("");


    const used =
        new Array(wordLength).fill(false);


    const results =
        new Array(wordLength).fill("absent");


    // ----------------------------------------
    // STEP 1
    // Find exact matches
    // ----------------------------------------

    for (
        let i = 0;
        i < wordLength;
        i++
    ) {

        if (guess[i] === answer[i]) {

            results[i] = "correct";

            used[i] = true;

        }

    }


    // ----------------------------------------
    // STEP 2
    // Find letters in wrong positions
    // ----------------------------------------

    for (
        let i = 0;
        i < wordLength;
        i++
    ) {

        if (results[i] === "correct") {

            continue;

        }


        for (
            let j = 0;
            j < wordLength;
            j++
        ) {

            if (
                !used[j] &&
                guess[i] === answer[j]
            ) {

                results[i] = "present";

                used[j] = true;

                break;

            }

        }

    }


    // ----------------------------------------
    // Display results
    // ----------------------------------------

    for (
        let i = 0;
        i < wordLength;
        i++
    ) {

        tiles[i].textContent =
            guess[i].toUpperCase();

        tiles[i].classList.remove(
            "current"
        );

        tiles[i].classList.add(
            results[i]
        );

    }


    // Update keyboard

    updateKeyboard(
        guess,
        results
    );

}


// --------------------------------------------
// UPDATE KEYBOARD
// --------------------------------------------

function updateKeyboard(
    guess,
    results
) {

    for (
        let i = 0;
        i < guess.length;
        i++
    ) {

        const letter =
            guess[i];

        const key =
            document.querySelector(
                `.key[data-letter="${letter}"]`
            );


        if (!key) continue;


        // Correct is always strongest

        if (
            results[i] === "correct"
        ) {

            key.classList.remove(
                "present",
                "absent"
            );

            key.classList.add(
                "correct"
            );

        }


        else if (
            results[i] === "present" &&
            !key.classList.contains("correct")
        ) {

            key.classList.remove(
                "absent"
            );

            key.classList.add(
                "present"
            );

        }


        else if (
            results[i] === "absent" &&
            !key.classList.contains("correct") &&
            !key.classList.contains("present")
        ) {

            key.classList.add(
                "absent"
            );

        }

    }

}


// --------------------------------------------
// WIN GAME
// --------------------------------------------

function winGame() {

    gameOver = true;


    statistics.played++;

    statistics.won++;

    statistics.streak++;


    saveStatistics();


    showMessage(
        `🎉 You cracked it! The word was ${secretWord.toUpperCase()}.`
    );


    updateStatistics();

}


// --------------------------------------------
// LOSE GAME
// --------------------------------------------

function loseGame() {

    gameOver = true;


    statistics.played++;

    statistics.streak = 0;


    saveStatistics();


    showMessage(
        `❌ Game over! The word was ${secretWord.toUpperCase()}.`
    );


    updateStatistics();

}


// --------------------------------------------
// SHOW MESSAGE
// --------------------------------------------

function showMessage(text) {

    message.textContent = text;

}


// --------------------------------------------
// SAVE STATISTICS
// --------------------------------------------

function saveStatistics() {

    localStorage.setItem(
        "wordBreakerStats",
        JSON.stringify(statistics)
    );

}


// --------------------------------------------
// UPDATE STATISTICS
// --------------------------------------------

function updateStatistics() {

    gamesPlayedDisplay.textContent =
        statistics.played;


    gamesWonDisplay.textContent =
        statistics.won;


    const rate =
        statistics.played === 0
            ? 0
            : Math.round(
                (statistics.won /
                statistics.played) * 100
            );


    winRateDisplay.textContent =
        rate + "%";


    streakDisplay.textContent =
        statistics.streak;

}


// --------------------------------------------
// NEW GAME BUTTON
// --------------------------------------------

newGameBtn.addEventListener(
    "click",
    startGame
);


// --------------------------------------------
// PHYSICAL KEYBOARD SUPPORT
// --------------------------------------------

document.addEventListener(
    "keydown",
    (event) => {

        if (gameOver) return;


        const key =
            event.key.toLowerCase();


        if (/^[a-z]$/.test(key)) {

            addLetter(key);

        }

        else if (
            event.key === "Backspace"
        ) {

            removeLetter();

        }

        else if (
            event.key === "Enter"
        ) {

            submitGuess();

        }

    }
);


// --------------------------------------------
// INITIALIZE
// --------------------------------------------

updateStatistics();

startGame();