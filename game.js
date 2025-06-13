const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const playerName = urlParams.get('player');
const roomCode = urlParams.get('room');
const isHost = urlParams.get('host') === 'true';

const gameInfo = document.getElementById('gameInfo');
const questionBox = document.getElementById('questionBox');
const optionBtns = document.querySelectorAll('.option-btn');
const timerEl = document.getElementById('timer');
const timerBar = document.getElementById('timerBar');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const resultBox = document.getElementById('resultBox');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

if (mode === 'multi') {
    gameInfo.innerHTML = `<p>👤 Player: ${playerName} | 🏠 Room: ${roomCode} ${isHost ? '(Host)' : ''}</p>`;
} else {
    gameInfo.innerHTML = `<p>👤 Player: ${playerName} | 🎮 Single Player Mode</p>`;
}

let rounds = {
    1: { questions: [], total: 10, pass: 70 },
    2: { questions: [], total: 10, pass: 80 },
    3: { questions: [], total: 5, pass: 80 }
};

let allQuestions = [
    // Round 1 Questions (Easy)
    { question: "Capital of France?", options: ["London", "Paris", "Berlin", "Rome"], correct: "Paris", round: 1 },
    { question: "5 + 3 = ?", options: ["7", "6", "8", "9"], correct: "8", round: 1 },
    { question: "Largest ocean?", options: ["Arctic", "Atlantic", "Pacific", "Indian"], correct: "Pacific", round: 1 },
    { question: "Who wrote 'Hamlet'?", options: ["Einstein", "Galileo", "Newton", "Shakespeare"], correct: "Shakespeare", round: 1 },
    { question: "Fastest land animal?", options: ["Lion", "Cheetah", "Tiger", "Leopard"], correct: "Cheetah", round: 1 },
    { question: "H2O is?", options: ["Oxygen", "Hydrogen", "Salt", "Water"], correct: "Water", round: 1 },
    { question: "Smallest planet?", options: ["Mercury", "Earth", "Mars", "Venus"], correct: "Mercury", round: 1 },
    { question: "Primary color?", options: ["Orange", "Purple", "Blue", "Green"], correct: "Blue", round: 1 },
    { question: "Largest continent?", options: ["Europe", "Australia", "Africa", "Asia"], correct: "Asia", round: 1 },
    { question: "Currency of Japan?", options: ["Euro", "Won", "Yen", "Dollar"], correct: "Yen", round: 1 },

    // Round 2 Questions (Medium)
    { question: "Square root of 144?", options: ["16", "14", "12", "10"], correct: "12", round: 2 },
    { question: "Largest mammal?", options: ["Elephant", "Giraffe", "Whale", "Shark"], correct: "Whale", round: 2 },
    { question: "Author of '1984'?", options: ["Orwell", "Shakespeare", "Dickens", "Hemingway"], correct: "Orwell", round: 2 },
    { question: "Chemical symbol of Gold?", options: ["Ag", "Au", "Go", "Gd"], correct: "Au", round: 2 },
    { question: "Fastest train in the world?", options: ["Maglev", "Bullet", "Metro", "Express"], correct: "Maglev", round: 2 },
    { question: "Deepest ocean trench?", options: ["Tonga", "Java", "Puerto Rico", "Mariana"], correct: "Mariana", round: 2 },
    { question: "Pi value (approx)?", options: ["2.17", "3.14", "3.00", "3.50"], correct: "3.14", round: 2 },
    { question: "Inventor of Light Bulb?", options: ["Tesla", "Newton", "Edison", "Galileo"], correct: "Edison", round: 2 },
    { question: "Highest mountain?", options: ["K2", "Fuji", "Kilimanjaro", "Everest"], correct: "Everest", round: 2 },
    { question: "Water freezes at?", options: ["10°C", "50°C", "0°C", "100°C"], correct: "0°C", round: 2 },

    // Final Round Questions (Hard)
    { question: "First computer?", options: ["Mac", "ENIAC", "PC", "IBM"], correct: "ENIAC", round: 3 },
    { question: "Quantum theory founder?", options: ["Planck", "Einstein", "Bohr", "Newton"], correct: "Planck", round: 3 },
    { question: "Year of Moon Landing?", options: ["1970", "1959", "1980", "1969"], correct: "1969", round: 3 },
    { question: "Largest desert?", options: ["Gobi", "Antarctic", "Sahara", "Arctic"], correct: "Antarctic", round: 3 },
    { question: "Most spoken language?", options: ["English", "Hindi", "Mandarin", "Spanish"], correct: "Mandarin", round: 3 }
];

Object.keys(rounds).forEach(r => {
    rounds[r].questions = allQuestions.filter(q => q.round === parseInt(r)).sort(() => Math.random() - 0.5);
});

let currentRound = 1;
let currentQuestion = 0;
let score = 0;
let timer = 15;
let interval;

function startQuiz() {
    displayQuestion();
    startTimer();
}

function displayQuestion() {
    const roundData = rounds[currentRound];
    const question = roundData.questions[currentQuestion];
    questionBox.textContent = question.question;

    optionBtns.forEach((btn, index) => {
        btn.textContent = question.options[index];
        btn.disabled = false;
        btn.style.backgroundColor = '#00c6ff';
    });
}

function startTimer() {
    timer = 15;
    timerEl.textContent = `⏳ ${timer}`;
    timerBar.style.width = '100%';

    interval = setInterval(() => {
        timer--;
        timerEl.textContent = `⏳ ${timer}`;
        timerBar.style.width = `${(timer / 15) * 100}%`;

        if (timer === 0) {
            clearInterval(interval);
            autoMoveNext();
        }
    }, 1000);
}

function autoMoveNext() {
    lockOptions();
    setTimeout(() => {
        nextQuestion();
    }, 1000);
}

function lockOptions() {
    optionBtns.forEach(btn => btn.disabled = true);
}

optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        clearInterval(interval);
        lockOptions();

        const selectedAnswer = btn.textContent;
        const question = rounds[currentRound].questions[currentQuestion];

        if (selectedAnswer === question.correct) {
            score += 10;
            btn.style.backgroundColor = 'green';
        } else {
            btn.style.backgroundColor = 'red';
        }

        scoreEl.textContent = `Score: ${score}`;

        setTimeout(() => {
            nextQuestion();
        }, 1000);
    });
});

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < rounds[currentRound].questions.length) {
        displayQuestion();
        startTimer();
    } else {
        evaluateRound();
    }
}

function evaluateRound() {
    const roundData = rounds[currentRound];
    const requiredScore = (roundData.total * roundData.pass) / 10;

    if (score >= requiredScore) {
        if (currentRound < 3) {
            alert(`🎉 You qualified for Round ${currentRound + 1}!`);
            currentRound++;
            currentQuestion = 0;
            startQuiz();
        } else {
            showResult(true);
        }
    } else {
        showResult(false);
    }
}

function showResult(isWinner) {
    document.querySelector('.quiz-card').style.display = 'none';
    resultBox.style.display = 'block';
    finalScore.textContent = isWinner ? `🏆 You are the Ultimate Winner! Final Score: ${score}` : `Game Over! Final Score: ${score}`;
}

restartBtn.addEventListener('click', () => {
    currentRound = 1;
    currentQuestion = 0;
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    resultBox.style.display = 'none';
    document.querySelector('.quiz-card').style.display = 'block';
    startQuiz();
});

startQuiz();
