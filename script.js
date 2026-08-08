// ============================================
// WORD BREAKER
// Datamuse API Edition
// ============================================


// ============================================
// API
// ============================================

const API_URL =
    "https://api.datamuse.com/words";


// ============================================
// HTML ELEMENTS
// ============================================

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

const loading =
    document.getElementById("loading");

const gamesPlayedDisplay =
    document.getElementById("gamesPlayed");

const gamesWonDisplay =
    document.getElementById("gamesWon");

const winRateDisplay =
    document.getElementById("winRate");

const streakDisplay =
    document.getElementById("streak");


// ============================================
// GAME STATE
// ============================================

let wordLength = 5;

let maxAttempts = 5;

let currentAttempt = 0;

let currentGuess = "";

let secretWord = "";

let gameOver = false;


// ============================================
// WORD CACHE
// ============================================

let words5 = [];

let words6 = [];


// ============================================
// STATISTICS
// ============================================

let statistics = {

    played: 0,

    won: 0,

    streak: 0

};


loadStatistics();


// ============================================
// LOAD STATISTICS
// ============================================

function loadStatistics() {

    const saved =
        localStorage.getItem(
            "wordBreakerStats"
        );

    if (!saved) {

        updateStatistics();

        return;

    }


    try {

        const parsed =
            JSON.parse(saved);


        if (
            typeof parsed.played === "number" &&
            typeof parsed.won === "number" &&
            typeof parsed.streak === "number"
        ) {

            statistics = parsed;

        }

    }

    catch {

        statistics = {

            played: 0,

            won: 0,

            streak: 0

        };

    }


    updateStatistics();

}


// ============================================
// SAVE STATISTICS
// ============================================

function saveStatistics() {

    localStorage.setItem(

        "wordBreakerStats",

        JSON.stringify(statistics)

    );

}


// ============================================
// UPDATE STATISTICS UI
// ============================================

function updateStatistics() {

    gamesPlayedDisplay.textContent =
        statistics.played;

    gamesWonDisplay.textContent =
        statistics.won;

    streakDisplay.textContent =
        statistics.streak;


    let rate = 0;


    if (statistics.played > 0) {

        rate = Math.round(

            (
                statistics.won /
                statistics.played
            ) * 100

        );

    }


    winRateDisplay.textContent =
        rate + "%";

}


// ============================================
// API REQUEST
// ============================================

async function getWords(length) {

    const pattern =
        "?".repeat(length);


    const url =
        `${API_URL}?sp=${encodeURIComponent(pattern)}&max=1000&md=f`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Datamuse request failed"
        );

    }


    const data =
        await response.json();


    const words = [];


    for (const item of data) {

        if (!item.word) {

            continue;

        }


        const word =
            item.word
                .trim()
                .toLowerCase();


        // Only pure alphabetic words

        if (
            !/^[a-z]+$/.test(word)
        ) {

            continue;

        }


        // Correct length

        if (
            word.length !== length
        ) {

            continue;

        }


        // Ignore obvious proper-looking
        // or unusual entries

        if (
            word.includes("'") ||
            word.includes("-")
        ) {

            continue;

        }


        words.push(word);

    }


    // Remove duplicates

    return [...new Set(words)];

}


// ============================================
// LOAD WORD DATABASE
// ============================================

async function loadWordDatabase() {

    loading.style.display = "block";

    gameBoard.innerHTML = "";

    keyboard.innerHTML = "";

    message.textContent =
        "Loading English words...";


    try {

        // Check local cache first

        const cached5 =
            getCachedWords("words5");

        const cached6 =
            getCachedWords("words6");


        if (
            cached5 &&
            cached5.length >= 100 &&
            cached6 &&
            cached6.length >= 100
        ) {

            words5 = cached5;

            words6 = cached6;

        }

        else {

            message.textContent =
                "Downloading English words...";


            const [five, six] =
                await Promise.all([

                    getWords(5),

                    getWords(6)

                ]);


            words5 = five;

            words6 = six;


            cacheWords(
                "words5",
                words5
            );

            cacheWords(
                "words6",
                words6
            );

        }


        loading.style.display = "none";

        message.textContent = "";


        startGame();

    }

    catch (error) {

        console.error(error);


        loading.style.display = "none";


        message.textContent =
            "⚠️ Couldn't load the word database. Check your internet connection and try again.";

    }

}


// ============================================
// CACHE WORDS
// ============================================

function cacheWords(key, words) {

    try {

        localStorage.setItem(

            key,

            JSON.stringify(words)

        );

    }

    catch (error) {

        console.warn(
            "Could not cache words.",
            error
        );

    }

}


// ============================================
// GET CACHED WORDS
// ============================================

function getCachedWords(key) {

    try {

        const value =
            localStorage.getItem(key);


        if (!value) {

            return null;

        }


        const words =
            JSON.parse(value);


        if (!Array.isArray(words)) {

            return null;

        }


        return words;

    }

    catch {

        return null;

    }

}


// ============================================
// START GAME
// ============================================

function startGame() {

    if (
        words5.length === 0 ||
        words6.length === 0
    ) {

        return;

    }


    // Randomly choose 5 or 6 letters

    wordLength =
        Math.random() < 0.5
            ? 5
            : 6;


    maxAttempts =
        wordLength;


    const wordList =
        wordLength === 5
            ? words5
            : words6;


    secretWord =
        chooseSecretWord(wordList);


    currentAttempt = 0;

    currentGuess = "";

    gameOver = false;


    wordLengthDisplay.textContent =
        wordLength;


    chancesDisplay.textContent =
        maxAttempts;


    message.textContent = "";


    createBoard();

    createKeyboard();


    console.log(
        "Secret word:",
        secretWord
    );

}


// ============================================
// CHOOSE SECRET WORD
// ============================================

function chooseSecretWord(list) {

    if (!list.length) {

        return "";

    }


    // Prefer the more common/top-ranked
    // words returned by Datamuse.

    // Most of the time select from
    // the first 70%.

    const top =
        Math.max(
            1,
            Math.floor(list.length * 0.7)
        );


    const index =
        Math.floor(
            Math.random() * top
        );


    return list[index];

}


// ============================================
// CREATE BOARD
// ============================================

function createBoard() {

    gameBoard.innerHTML = "";


    for (
        let row = 0;
        row < maxAttempts;
        row++
    ) {

        const rowElement =
            document.createElement("div");


        rowElement.className =
            "guess-row";


        for (
            let column = 0;
            column < wordLength;
            column++
        ) {

            const tile =
                document.createElement("div");


            tile.className =
                "tile";


            tile.dataset.row =
                row;


            tile.dataset.column =
                column;


            rowElement.appendChild(
                tile
            );

        }


        gameBoard.appendChild(
            rowElement
        );

    }

}


// ============================================
// CREATE KEYBOARD
// ============================================

function createKeyboard() {

    keyboard.innerHTML = "";


    const rows = [

        "QWERTYUIOP",

        "ASDFGHJKL",

        "ZXCVBNM"

    ];


    rows.forEach(row => {

        for (const letter of row) {

            const button =
                document.createElement("button");


            button.className =
                "key";


            button.textContent =
                letter;


            button.dataset.letter =
                letter.toLowerCase();


            button.addEventListener(
                "click",
                () =>
                    addLetter(
                        letter.toLowerCase()
                    )
            );


            keyboard.appendChild(
                button
            );

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


    keyboard.appendChild(
        backspace
    );


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


    keyboard.appendChild(
        enter
    );

}


// ============================================
// ADD LETTER
// ============================================

function addLetter(letter) {

    if (gameOver) {

        return;

    }


    if (
        currentGuess.length >=
        wordLength
    ) {

        return;

    }


    currentGuess += letter;


    updateCurrentRow();

}


// ============================================
// REMOVE LETTER
// ============================================

function removeLetter() {

    if (gameOver) {

        return;

    }


    currentGuess =
        currentGuess.slice(
            0,
            -1
        );


    updateCurrentRow();

}


// ============================================
// UPDATE CURRENT ROW
// ============================================

function updateCurrentRow() {

    const row =
        gameBoard.children[
            currentAttempt
        ];


    if (!row) {

        return;

    }


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

            Boolean(
                currentGuess[i]
            )

        );

    }

}


// ============================================
// VALIDATE WORD WITH DATAMUSE
// ============================================

async function isValidWord(word) {

    const url =
        `${API_URL}?sp=${encodeURIComponent(word)}&max=10`;


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            return false;

        }


        const data =
            await response.json();


        return data.some(
            item =>
                typeof item.word === "string" &&
                item.word.toLowerCase() === word
        );

    }

    catch (error) {

        console.error(error);

        return false;

    }

}


// ============================================
// SUBMIT GUESS
// ============================================

async function submitGuess() {

    if (gameOver) {

        return;

    }


    if (
        currentGuess.length !==
        wordLength
    ) {

        showMessage(
            `Enter exactly ${wordLength} letters.`
        );

        return;

    }


    const guess =
        currentGuess;


    // Temporarily disable keyboard
    // while checking the API.

    setKeyboardEnabled(false);


    showMessage(
        "Checking word..."
    );


    const valid =
        await isValidWord(guess);


    if (!valid) {

        showMessage(
            "❌ That's not a recognized English word."
        );


        setKeyboardEnabled(true);

        return;

    }


    evaluateGuess();


    currentAttempt++;


    chancesDisplay.textContent =
        maxAttempts -
        currentAttempt;


    currentGuess = "";


    // Check win

    if (
        isCurrentRowCorrect()
    ) {

        winGame();

        return;

    }


    // Check loss

    if (
        currentAttempt >=
        maxAttempts
    ) {

        loseGame();

        return;

    }


    setKeyboardEnabled(true);

    message.textContent = "";

}


// ============================================
// CHECK CURRENT ROW
// ============================================

function isCurrentRowCorrect() {

    const row =
        gameBoard.children[
            currentAttempt - 1
        ];


    if (!row) {

        return false;

    }


    const correctTiles =
        row.querySelectorAll(
            ".correct"
        );


    return (
        correctTiles.length ===
        wordLength
    );

}


// ============================================
// EVALUATE GUESS
// ============================================

function evaluateGuess() {

    const row =
        gameBoard.children[
            currentAttempt
        ];


    const tiles =
        row.children;


    const answer =
        secretWord.split("");


    const guess =
        currentGuess.split("");


    const used =
        new Array(
            wordLength
        ).fill(false);


    const results =
        new Array(
            wordLength
        ).fill("absent");


    // ----------------------------------------
    // FIRST PASS:
    // Exact matches
    // ----------------------------------------

    for (
        let i = 0;
        i < wordLength;
        i++
    ) {

        if (
            guess[i] ===
            answer[i]
        ) {

            results[i] =
                "correct";


            used[i] =
                true;

        }

    }


    // ----------------------------------------
    // SECOND PASS:
    // Wrong position
    // ----------------------------------------

    for (
        let i = 0;
        i < wordLength;
        i++
    ) {

        if (
            results[i] ===
            "correct"
        ) {

            continue;

        }


        for (
            let j = 0;
            j < wordLength;
            j++
        ) {

            if (
                !used[j] &&
                guess[i] ===
                answer[j]
            ) {

                results[i] =
                    "present";


                used[j] =
                    true;


                break;

            }

        }

    }


    // ----------------------------------------
    // DISPLAY
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


    updateKeyboard(
        guess,
        results
    );

}


// ============================================
// KEYBOARD STATUS
// ============================================

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


        if (!key) {

            continue;

        }


        // Correct is strongest

        if (
            results[i] ===
            "correct"
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
            results[i] ===
            "present"
        ) {

            if (
                !key.classList.contains(
                    "correct"
                )
            ) {

                key.classList.remove(
                    "absent"
                );


                key.classList.add(
                    "present"
                );

            }

        }


        else {

            if (
                !key.classList.contains(
                    "correct"
                ) &&
                !key.classList.contains(
                    "present"
                )
            ) {

                key.classList.add(
                    "absent"
                );

            }

        }

    }

}


// ============================================
// ENABLE / DISABLE KEYBOARD
// ============================================

function setKeyboardEnabled(
    enabled
) {

    const buttons =
        keyboard.querySelectorAll(
            "button"
        );


    buttons.forEach(button => {

        button.disabled =
            !enabled;

        button.style.opacity =
            enabled ? "1" : "0.55";

    });

}


// ============================================
// WIN
// ============================================

function winGame() {

    gameOver = true;


    statistics.played++;

    statistics.won++;

    statistics.streak++;


    saveStatistics();

    updateStatistics();


    setKeyboardEnabled(
        false
    );


    showMessage(

        `🎉 Brilliant! The word was ${secretWord.toUpperCase()}.`

    );

}


// ============================================
// LOSE
// ============================================

function loseGame() {

    gameOver = true;


    statistics.played++;

    statistics.streak = 0;


    saveStatistics();

    updateStatistics();


    setKeyboardEnabled(
        false
    );


    showMessage(

        `❌ Out of chances! The word was ${secretWord.toUpperCase()}.`

    );

}


// ============================================
// MESSAGE
// ============================================

function showMessage(text) {

    message.textContent =
        text;

}


// ============================================
// NEW GAME
// ============================================

newGameBtn.addEventListener(
    "click",
    () => {

        if (
            words5.length &&
            words6.length
        ) {

            startGame();

        }

    }
);


// ============================================
// PHYSICAL KEYBOARD
// ============================================

document.addEventListener(
    "keydown",
    event => {

     