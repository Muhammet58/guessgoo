let number = Math.floor(Math.random() * 100);
let numberInput = document.querySelector(".number-input");
let guessBtn = document.querySelector(".guess-btn");
let rebootBtn = document.getElementById("rebootBtn");
let directionText = document.querySelector(".direction-text");
let trialCounterText = document.querySelector(".trial-counter");
let scoreCounter = document.querySelector(".score-counter");
let themeBtn = document.querySelector(".theme-btn");
let toggle = document.querySelector(".toggle");

let changeThemetItems = document.querySelectorAll(`.main, .box, .title, 
    .text, .direction-text, .theme-btn, .toggle, .icon, .tag, 
    .number-input, .guess-btn, .reboot-btn`);

let bestScore = 0;
let trialCounter = 0;
let trial = 5;
let isFound = false;
let isDarkMode = false;
let isDomContentloaded = false;
let bestScoreArray;

numberInput.addEventListener("input", (e) => {
    let data = e.data;
    if (isNaN(data)) {
        numberInput.value = numberInput.value.slice(0, -1);
    }
});

guessBtn.addEventListener("click", () => {
    let text;
    if (trialCounter === trial || isFound) return;

    if (!numberInput.value || numberInput.value < 1 || numberInput.value > 100) {
        text = "1 ile 100 arasında bir tahminde bulun";
    } else {
        if (numberInput.value < number || numberInput.value > number) {
            text = numberInput.value < number ? "Daha büyük bir sayı dene" : "Daha küçük bir sayı dene";
            trialCounter++;
            trialCounterText.textContent = trialCounter;

            if (trialCounter === trial) {
                directionText.innerHTML = `Deneme hakkın bitti. <br> Sayı: ${number}`;
                rebootBtn.style.display = "block";
                return;
            }
        } else {
            trialCounter++;
            if (!bestScoreArray.includes(trialCounter)) {
                bestScoreArray.push(trialCounter);
            }

            bestScore = Math.min(...bestScoreArray);
            trialCounterText.textContent = trialCounter;
            directionText.innerHTML = `Tebrikler sayıyı buldun! <br> Sayı: ${number}`;
            rebootBtn.style.display = "block";
            scoreCounter.textContent = bestScore;
            localStorage.setItem("best-score", JSON.stringify(bestScoreArray));
            isFound = true;
            return;
        }
    }

    directionText.textContent = text;
});

rebootBtn.addEventListener("click", () => {
    trialCounter = 0;
    trialCounterText.textContent = 0;
    number = Math.floor(Math.random() * 100);
    rebootBtn.style.display = "none";
    directionText.textContent = "";
    numberInput.value = "";
    isFound = false;
});

guessBtn.addEventListener("mousedown", (e) => e.preventDefault());

themeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;

    changeThemetItems.forEach((item) => {
        if (isDarkMode) {
            item.classList.add("dark-mode");
            item.style.transition = isDomContentloaded ? "none" : "ease .3s";
        } else {
            isDomContentloaded = false
            item.classList.remove("dark-mode");
            item.style.transition = "ease .3s";
        }
    });

    toggle.style.transform = isDarkMode ? "translateX(28px)" : "translateX(0)";
    localStorage.setItem("dark-mode", isDarkMode);
});


document.addEventListener("DOMContentLoaded", () => {
    let localStorageDarkMode = localStorage.getItem("dark-mode") === "true";

    if (!localStorage.getItem("best-score")) {
        localStorage.setItem("best-score", JSON.stringify([]));
    }

    bestScoreArray = JSON.parse(localStorage.getItem("best-score"));
    scoreCounter.textContent = bestScoreArray.length > 0 ? Math.min(...bestScoreArray) : 0;

    if (localStorageDarkMode) {
        isDomContentloaded = true;
        themeBtn.click();
    } else {
        isDomContentloaded = false;
    }
});
