let roundId = crypto.randomUUID();
let score = 0;
let right = 0;
let wrong = 0;
let flips = 0;
let elapsedTime = 0; // Time elapsed in seconds
let timerInterval;
let currentStackIndex = 4; // Start with the left-top most stack of "4 of hearts"

const topCenterDiv = document.querySelector('.top-center');
const bottomCenterDiv = document.querySelector('.bottom-center');
const circleContainer = document.querySelector('.circle-container');

const cornerSymbols = document.querySelectorAll('.symbol');

[topCenterDiv, bottomCenterDiv, circleContainer].forEach(dropZone => {
    dropZone.addEventListener('dragover', dragOver);
    dropZone.addEventListener('drop', drop);
});

cornerSymbols.forEach(symbol => {
    symbol.addEventListener('dragover', dragOver);
    symbol.addEventListener('drop', drop);
});
