let range = 50;
let number = Math.floor(Math.random() * (range - 2)) + 2;
let numberInput = document.querySelector(".number-input");
let guessBtn = document.querySelector(".guess-btn");
let rebootBtn = document.getElementById("rebootBtn");
let directionText = document.querySelector(".direction-text");
let trialCounterText = document.querySelector(".trial-counter");
let scoreCounter = document.querySelector(".score-counter");
let themeBtn = document.querySelector(".theme-btn");
let toggle = document.querySelector(".toggle");
let difficultyBtns = document.querySelector(".difficulty-buttons");
let difficultyIndicator = document.querySelector(".difficulty-indicator")
let numberRangeText = document.querySelector(".number-range")
let trialText = document.querySelector(".trial")
let trialAllText = document.querySelector(".trial-text")
let gameModeBtns = document.querySelector(".game-mode-buttons")
let gameModeIndicator = document.querySelector(".game-mode-indicator")

let changeThemetItems = document.querySelectorAll(`.main, .box, .title, 
    .text, .direction-text, .theme-btn, .toggle, .icon, .tag, 
    .number-input, .guess-btn, .reboot-btn, .difficulty-buttons, .difficulty-btn, .difficulty-indicator,
    .game-mode-buttons, .game-mode-indicator, .game-mode-btn`);

let time = 30;
let trial = 6;
let trialCounter = 0;
let bestScore = 0;
let bestScoreArray = [];
let difficulty = "easy";
let gameMode = 'score';
let difficultyMultiplier = 1;
let isFound = false;
let isDarkMode = false;
let isDomContentloaded = false;
let timerStarted = true;
let timer;


numberInput.addEventListener("input", (e) => {
    let data = e.data;
    if (isNaN(data)) numberInput.value = numberInput.value.slice(0, -1);

    if (gameMode === "time" && timerStarted && rebootBtn.style.display === 'none') {
        timerStarted = false
        timer = setInterval(() => {
            time--
            trialAllText.textContent = `Süre: ${time}sn`
            if (time <= 0) {
                clearInterval(timer);
                trialAllText.textContent = "Süre Doldu";
                directionText.innerHTML = `Süren Doldu. <br> Sayı: ${number}`;
                rebootBtn.style.display = "block";
                timerStarted = true;
            }
        }, 1000)
    }
});


guessBtn.addEventListener("click", () => {
    let scoreFormul;
    
    if ((gameMode === "score" && (trialCounter === trial || isFound)) ||
        (gameMode === "time" && (time <= 0 || isFound))) return;

    const guess = parseInt(numberInput.value);

    if (!guess|| guess < 1 || guess > range) {
        directionText.textContent = `1 ile ${range} arasında bir tahminde bulun`
        return;
    }
    
    if (guess !== number) {
        directionText.textContent = guess < number ? "Daha büyük bir sayı dene" : "Daha küçük bir sayı dene";

        directionText.classList.add("shake");
        directionText.addEventListener("animationend", () => directionText.classList.remove("shake"), { once: true });
           
        if (gameMode === "score") {
            trialCounter++;
            trialCounterText.textContent = trialCounter;
            
            if (trialCounter === trial) {
                directionText.classList.remove("shake");
                directionText.innerHTML = `Deneme hakkın bitti. <br> Sayı: ${number}`;
                rebootBtn.style.display = "block";
            }
        }
        return;
    } 
        
    if (gameMode === "score") {
        trialCounter++;
        scoreFormul = Math.floor((1000 / trialCounter) * difficultyMultiplier);
        trialCounterText.textContent = trialCounter;
    } else {
        scoreFormul = Math.floor((time * 10) * difficultyMultiplier);
    }

    if (!bestScoreArray.includes(scoreFormul)) bestScoreArray.push(scoreFormul);

    bestScore = Math.max(...bestScoreArray);
    scoreCounter.textContent = bestScore;
    localStorage.setItem("best-score", JSON.stringify(bestScoreArray));
    
    directionText.innerHTML = `Tebrikler sayıyı buldun! <br> Sayı: ${number} Skor: ${scoreFormul}`;
    rebootBtn.style.display = "block";
    clearInterval(timer)
    timerStarted = true;
    isFound = true;
});


rebootBtn.addEventListener("click", () => {
    trialCounter = 0;
    trialCounterText.textContent = 0;
    
    if (gameMode === "time") {
        const defaultTimes = {"easy": 30, "medium": 45, "hard": 75}
        time = defaultTimes[difficulty]
        trialAllText.textContent = `Süre: ${time}sn`
    }

    number = Math.floor(Math.random() * (range - 2)) + 2;
    rebootBtn.style.display = "none";
    directionText.textContent = "";
    numberInput.value = "";
    isFound = false;
});


guessBtn.addEventListener("mousedown", (e) => e.preventDefault());


themeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;

    changeThemetItems.forEach((item) => {
        item.classList.toggle("dark-mode", isDarkMode);
        item.style.transition = isDomContentloaded ? "none" : "ease .3s";
        
        if (!isDarkMode) {
            isDomContentloaded = false
            item.style.transition = "ease .3s";
        }
    });

    toggle.style.transform = isDarkMode ? "translateX(28px)" : "translateX(0)";
    localStorage.setItem("dark-mode", isDarkMode);
});


difficultyBtns.addEventListener("click", (event) => {
    const mode = event.target.dataset.mode;
    if (!mode) return;
    
    const isMobile = screen.width <= 600;

    const modes = {
        easy: {move: isMobile ? "translateX(-77px)" : "translateX(-97px)", trial: 6, time: 30, range: 50, difficulty: "easy", multiplier: 1},
        medium: {move: "translateX(0px)", trial: 8, time: 45, range: 100, difficulty: "medium", multiplier: 1.5},
        hard: {move: isMobile ? "translateX(77px)" : "translateX(97px)", trial: 10, time: 75, range: 500, difficulty: "hard", multiplier: 2}
    }

    const selected = modes[mode];
    if (difficultyIndicator.style.transform === selected.move) return;

    difficultyIndicator.style.transition = "ease .3s";
    difficultyIndicator.style.transform = selected.move;

    clearInterval(timer);
    timerStarted = true
    trialCounter = 0;
    trial = selected.trial;
    time = selected.time
    range = selected.range;
    difficultyMultiplier = selected.multiplier;
    difficulty = selected.difficulty
    number = Math.floor(Math.random() * (range - 2)) + 2;

    numberRangeText.textContent = `1 ile ${range}`;
    trialCounterText.textContent = trialCounter;
    trialText.textContent = trial;
    trialAllText.textContent = gameMode === "score" ? "Deneme:" : `Süre: ${time}sn`
    rebootBtn.style.display = "none";
    directionText.textContent = "";
    numberInput.value = "";
    isFound = false;
});


gameModeBtns.addEventListener("click", (event) => {
    const type = event.target.dataset.type;
    if (!type) return;
    
    const isMobile = screen.width <= 600;

    const types = {
        score: {move: isMobile ? "translateX(-54px)" : "translateX(-67px)", trialText: `Deneme:`, gameMode: "score", timerStarted: false},
        time: {move: isMobile ? "translateX(54px)" : "translateX(67px)", trialText: `Süre: ${time}sn`, gameMode: "time", timerStarted: true},
    };

    const selected = types[type];
    if (gameModeIndicator.style.transform === selected.move) return;

    gameModeIndicator.style.transition = "ease .3s";
    const difficultyTimeAndTrial = {"easy": {time: 30, trial: 6}, "medium": {time: 45, trial: 8}, "hard": {time: 75, trial: 10}}
    time = difficultyTimeAndTrial[difficulty].time
    trial = difficultyTimeAndTrial[difficulty].trial

    clearInterval(timer)
    trialCounter = 0;
    timerStarted = selected.timerStarted
    gameModeIndicator.style.transform = selected.move;
    trialAllText.textContent = selected.trialText
    trialText.textContent = trial
    trialCounterText.textContent = trialCounter
    gameMode = selected.gameMode
    
    trialCounterText.style.display = gameMode === "score" ? "inline-block" : "none";
    trialText.style.display = gameMode === "score" ? "inline-block" : "none";
    document.querySelector(".slash").style.display = gameMode === "score" ? "inline-block" : "none";

    numberInput.value = "";
    directionText.textContent = "";
    rebootBtn.style.display = "none";
    number = Math.floor(Math.random() * (range - 2)) + 2;
    isFound = false;
})


document.addEventListener("DOMContentLoaded", () => {
    bestScoreArray = JSON.parse(localStorage.getItem("best-score"));
    scoreCounter.textContent = bestScoreArray.length > 0 ? Math.max(...bestScoreArray) : 0;
    const darkModeActive = localStorage.getItem("dark-mode") === "true";

    if (!localStorage.getItem("best-score")) {
        localStorage.setItem("best-score", JSON.stringify([]));
    }

    if (darkModeActive) {
        isDomContentloaded = true;
        themeBtn.click();
    } else {
        isDomContentloaded = false;
    }
});


document.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && numberInput.value) {
        guessBtn.click()
    }
})
