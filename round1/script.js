const cardsData = [
    [{ value: '1', suit: 'checkmark' }, { value: '2', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }, { value: '4', suit: 'checkmark' }, { value: '2', suit: 'checkmark' }],
    [{ value: '5', suit: 'checkmark' }, { value: '6', suit: 'checkmark' }, { value: '7', suit: 'checkmark' }, { value: '8', suit: 'checkmark' }, { value: '5', suit: 'checkmark' }],
    [{ value: '9', suit: 'checkmark' }, { value: '10', suit: 'checkmark' }, { value: 'J', suit: 'checkmark' }, { value: 'Q', suit: 'checkmark' }, { value: '8', suit: 'checkmark' }],
    [{ value: 'K', suit: 'checkmark' }, { value: '1', suit: 'checkmark' }, { value: '2', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }],
    [{ value: '4', suit: 'checkmark' }, { value: '5', suit: 'checkmark' }, { value: '6', suit: 'checkmark' }, { value: '7', suit: 'checkmark' }, { value: '5', suit: 'checkmark' }],
    [{ value: '8', suit: 'checkmark' }, { value: '9', suit: 'checkmark' }, { value: '10', suit: 'checkmark' }, { value: 'J', suit: 'checkmark' }, { value: 'K', suit: 'checkmark' }]
];


const suitEntities = {
    checkmark: '&#10003;' // Checkmark symbol
};

let score = 0;
let right =0;
let wrong =0;
let currentStackIndex = 4; // Start with the left-top most stack of "4 of hearts"
let startTime = Date.now();
let timerInterval;

function createCardElement(data, id) {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = id;
    card.setAttribute('data-value', data.value);
    card.setAttribute('data-suit', data.suit);
    card.setAttribute('draggable', 'true');

    const spanValue = document.createElement('span');
    spanValue.textContent = data.value;
    const spanSuit = document.createElement('span');
    spanSuit.className = 'suit';
    spanSuit.innerHTML = suitEntities[data.suit];

    card.appendChild(spanValue);
    card.appendChild(spanSuit);

    if (data.suit === 'checkmark') {
        spanSuit.style.color = 'transparent';
    }

    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);

    return card;
}

function loadInitialCards() {
    const circleContainer = document.querySelector('.circle-container');
    for (let i = 0; i < cardsData.length; i++) {
        if (cardsData[i].length > 0) {
            const cardData = cardsData[i][0];
            const card = createCardElement(cardData, `card${i + 1}`);
            circleContainer.appendChild(card);
        }
    }
    positionCards();
    highlightCurrentStack();
    startTimer();
}

function loadNextCard(cardIndex, placeholder) {
    if (cardsData[cardIndex].length > 0) {
        cardsData[cardIndex].shift(); // Remove the first card
    }
    if (cardsData[cardIndex].length > 0) {
        const nextCardData = cardsData[cardIndex][0];
        const nextCard = createCardElement(nextCardData, `card${cardIndex + 1}`);
        nextCard.style.left = placeholder.style.left;
        nextCard.style.top = placeholder.style.top;
        nextCard.setAttribute('data-original-left', nextCard.style.left);
        nextCard.setAttribute('data-original-top', nextCard.style.top);
        placeholder.replaceWith(nextCard);
    } else {
        placeholder.style.borderColor = 'black';
        placeholder.style.backgroundColor = 'transparent';
    }

    if (isGameOver()) {
        stopTimer();
        showModal();
    }
    currentStackIndex = (currentStackIndex + 1) % cardsData.length;
    highlightCurrentStack();
}

function highlightCurrentStack() {
    document.querySelectorAll('.card').forEach(card => {
        card.style.borderColor = '#000'; // Reset border color for all cards
    });
    const currentCard = document.querySelector(`#card${currentStackIndex + 1}`);
    if (currentCard) {
        currentCard.style.borderColor = 'yellow';
    }
}

function isGameOver() {
    return cardsData.every(stack => stack.length === 0);
}

function showModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>Please proceed to the next round</p>
            <button id="nextRoundButton">Next Round</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('nextRoundButton').addEventListener('click', () => {
        document.body.classList.add('fade-out');
        setTimeout(() => {       
    const params = getQueryParams();
    const uniqueId = params.uniqueId;
            window.location.href = `/round2i/index.html?uniqueId=${uniqueId}`;
        }, 500); // Wait for the fade-out transition to complete
    });

    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Final Score: ${score}`);
    console.log(`Total Time: ${elapsedTime}s`);
    console.log(`Right: ${right}`);
    console.log(`Wrong: ${wrong}`);

    if (elapsedTime > 90){
        score-=50;
        document.getElementById('score').textContent = `Score: ${score}`;
    }

    const params = getQueryParams();
    const uniqueId = params.uniqueId;

    const data = {
        uniqueId:uniqueId,
        round:1,
        score: score,
        right: right,
        wrong: wrong,
        time: elapsedTime
    };

    

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .catch((error) => {
        console.error('Error:', error);
    });

    
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time').textContent = `Time: ${elapsedTime}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

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

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.classList.add('dragging');
    }, 0);
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropZone = event.target;
    const cardValue = draggableElement.getAttribute('data-value');
    const cardSuit = draggableElement.getAttribute('data-suit');
    const cardIndex = parseInt(id.replace('card', '')) - 1;

    let points = 0;

    if (cardIndex !== currentStackIndex) {
        highlightCurrentStack();
        return;
    }

    if (dropZone === topCenterDiv || dropZone.closest('.top-center')) {
        if (['K', 'Q', 'J'].includes(cardValue)) {
            draggableElement.style.backgroundColor = 'green';
            points = 10;
            right+=1;
        } else {
            draggableElement.style.backgroundColor = 'red';
            points = -10;
            wrong+=1;
        }
        updateScore(points);
        setTimeout(() => {
            const placeholder = document.createElement('div');
            placeholder.className = 'disappeared';
            placeholder.style.left = draggableElement.style.left;
            placeholder.style.top = draggableElement.style.top;
            placeholder.style.position = 'absolute';
            placeholder.style.width = '80px';
            placeholder.style.height = '120px';
            circleContainer.appendChild(placeholder);
            draggableElement.remove();
            loadNextCard(cardIndex, placeholder);
        }, 500);
    } else if (dropZone === bottomCenterDiv || dropZone.closest('.bottom-center')) {
        if (!isNaN(cardValue) && Number(cardValue) >= 1 && Number(cardValue) <= 10) {
            draggableElement.style.backgroundColor = 'green';
            points = 10;
            right+=1;
        } else {
            draggableElement.style.backgroundColor = 'red';
            points = -10;
            wrong+=1; 
        }
        updateScore(points);
        setTimeout(() => {
            const placeholder = document.createElement('div');
            placeholder.className = 'disappeared';
            placeholder.style.left = draggableElement.style.left;
            placeholder.style.top = draggableElement.style.top;
            placeholder.style.position = 'absolute';
            placeholder.style.width = '80px';
            placeholder.style.height = '120px';
            circleContainer.appendChild(placeholder);
            draggableElement.remove();
            loadNextCard(cardIndex, placeholder);
        }, 500);
    } else if (dropZone.closest('.symbol')) {
        const symbolSuit = dropZone.getAttribute('data-suit');
        if (cardSuit === symbolSuit) {
            draggableElement.style.backgroundColor = 'green';
            points = 10;
            right+=1;
        } else {
            draggableElement.style.backgroundColor = 'red';
            points = -10;
            wrong+=1;
        }
        updateScore(points);
        setTimeout(() => {
            const placeholder = document.createElement('div');
            placeholder.className = 'disappeared';
            placeholder.style.left = draggableElement.style.left;
            placeholder.style.top = draggableElement.style.top;
            placeholder.style.position = 'absolute';
            placeholder.style.width = '80px';
            placeholder.style.height = '120px';
            circleContainer.appendChild(placeholder);
            draggableElement.remove();
            loadNextCard(cardIndex, placeholder);
        }, 500);
    } else if (dropZone.closest('.circle-container')) {
        const dropRect = circleContainer.getBoundingClientRect();
        const dropX = event.clientX - dropRect.left;
        const dropY = event.clientY - dropRect.top;
        draggableElement.style.left = `${dropX - draggableElement.offsetWidth / 2}px`;
        draggableElement.style.top = `${dropY - draggableElement.offsetHeight / 2}px`;
    }
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = `Score: ${score}`;
    console.log(`Current Score: ${score}`);
}

function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}

function positionCards() {
    const circle = document.getElementById('circle');
    const rect = circle.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) - 30; // Adjust radius to fit cards within the circle

    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach((card, index) => {
        const angle = (index / cardElements.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle) - card.offsetWidth / 2;
        const y = centerY + radius * Math.sin(angle) - card.offsetHeight / 2;
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        card.setAttribute('data-original-left', card.style.left);
        card.setAttribute('data-original-top', card.style.top);
    });
}

window.addEventListener('resize', positionCards);
document.addEventListener('DOMContentLoaded', () => {
    loadInitialCards();
    positionCards();
});
