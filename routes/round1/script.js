const cardsData = [
    [{ value: '1', suit: 'checkmark' }, { value: '2', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }, { value: '4', suit: 'checkmark' }, { value: '2', suit: 'checkmark' }],
    [{ value: '5', suit: 'checkmark' }, { value: '6', suit: 'checkmark' }, { value: '7', suit: 'checkmark' }, { value: '8', suit: 'checkmark' }, { value: '5', suit: 'checkmark' }],
    [{ value: '9', suit: 'checkmark' }, { value: '10', suit: 'checkmark' }, { value: 'J', suit: 'checkmark' }, { value: 'Q', suit: 'checkmark' }, { value: '8', suit: 'checkmark' }],
    [{ value: 'K', suit: 'checkmark' }, { value: '1', suit: 'checkmark' }, { value: '2', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }],
    [{ value: '4', suit: 'checkmark' }, { value: '5', suit: 'checkmark' }, { value: '6', suit: 'checkmark' }, { value: '7', suit: 'checkmark' }, { value: '5', suit: 'checkmark' }],
    [{ value: '8', suit: 'checkmark' }, { value: '9', suit: 'checkmark' }, { value: '10', suit: 'checkmark' }, { value: 'J', suit: 'checkmark' }, { value: 'K', suit: 'checkmark' }]
];

let roundLevel = 1;

async function drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);
    const dropZone = event.target;

    if (dropZone.classList.contains('card')) {
        return;
    }

    const cardValue = draggableElement.getAttribute('data-value');
    const cardSuit = draggableElement.getAttribute('data-suit');
    const cardIndex = parseInt(id.replace('card', '')) - 1;

    let points = 0;

    if (cardIndex !== currentStackIndex) {
        highlightCurrentStack();
        return;
    }

    if (dropZone === topCenterDiv) {
        if (['K', 'Q', 'J'].includes(cardValue)) {
            draggableElement.style.backgroundColor = 'green';
            points = 10;
            right += 1;
        } else {
            draggableElement.style.backgroundColor = 'red';
            points = -10;
            wrong += 1;
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
    } else if (dropZone === bottomCenterDiv) {
        if (!isNaN(cardValue) && Number(cardValue) >= 1 && Number(cardValue) <= 10) {
            draggableElement.style.backgroundColor = 'green';
            points = 10;
            right += 1;
        } else {
            draggableElement.style.backgroundColor = 'red';
            points = -10;
            wrong += 1;
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
    } else if (dropZone.classList.contains('symbol')) {
        const symbolSuit = dropZone.getAttribute('data-suit');
        if (cardSuit === symbolSuit) {
            draggableElement.style.backgroundColor = 'green';
            points = 10;
            right += 1;
        } else {
            draggableElement.style.backgroundColor = 'red';
            points = -10;
            wrong += 1;
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
    }

    await fetch('/api/event', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            eventName: 'Card Dropped',
            roundId,
            roundLevel,
            currentCard: JSON.stringify({ value: cardValue, suit: cardSuit, index: cardIndex }),
            points,
            timestamp: new Date().toISOString()
        })
    });
}

window.addEventListener('resize', positionCards);
document.addEventListener('DOMContentLoaded', async () => {
    await loadInitialCards(cardsData);
    positionCards();
    startClock();
});

