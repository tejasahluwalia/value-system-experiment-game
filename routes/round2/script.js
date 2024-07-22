const cardsData = [
    [{ value: '2', suit: 'checkmark' }, { value: '8', suit: 'spades' }, { value: '4', suit: 'checkmark' }, { value: '2', suit: 'diamonds' }, { value: 'J', suit: 'checkmark' }],
    [{ value: 'Q', suit: 'checkmark' }, { value: '7', suit: 'spades' }, { value: '3', suit: 'hearts' }, { value: 'J', suit: 'checkmark' }, { value: 'Q', suit: 'spades' }],
    [{ value: '4', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }, { value: '6', suit: 'diamonds' }, { value: 'K', suit: 'clubs' }, { value: '2', suit: 'clubs' }],
    [{ value: '1', suit: 'checkmark' }, { value: '6', suit: 'checkmark' }, { value: '9', suit: 'checkmark' }, { value: '10', suit: 'checkmark' }, { value: '4', suit: 'checkmark' }],
    [{ value: '5', suit: 'checkmark' }, { value: '2', suit: 'hearts' }, { value: 'K', suit: 'clubs' }, { value: '3', suit: 'spades' }, { value: '8', suit: 'hearts' }],
    [{ value: 'J', suit: 'checkmark' }, { value: '8', suit: 'spades' }, { value: '2', suit: 'checkmark' }, { value: '3', suit: 'checkmark' }, { value: '10', suit: 'hearts' }]
];

let roundLevel = 2;

async function drop(event) {
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

    if (cardSuit === 'checkmark') {
        if (dropZone === topCenterDiv) {
            if (['K', 'Q', 'J'].includes(cardValue)) {
                draggableElement.style.backgroundColor = 'green';
                points = 10;
                right += 1
            } else {
                draggableElement.style.backgroundColor = 'red';
                points = -10;
                wrong += 1
            }
        } else if (dropZone === bottomCenterDiv) {
            if (!isNaN(cardValue) && Number(cardValue) >= 1 && Number(cardValue) <= 10) {
                draggableElement.style.backgroundColor = 'green';
                points = 10;
                right += 1
            } else {
                draggableElement.style.backgroundColor = 'red';
                points = -10;
                wrong += 1
            }
        } else {
            highlightCurrentStack();
            return;
        }
    } else {
        if (dropZone.classList.contains('symbol')) {
            const symbolSuit = dropZone.getAttribute('data-suit');
            if (cardSuit === symbolSuit) {
                draggableElement.style.backgroundColor = 'green';
                if (['K', 'Q', 'J'].includes(cardValue)) {
                    points = 10 + 10;
                }
                else {
                    points = 10 + Number(cardValue);
                }
                // Correct symbol guessed
                right += 1
            } else {
                draggableElement.style.backgroundColor = 'red';
                points = -10;
                if (['K', 'Q', 'J'].includes(cardValue)) {
                    points = -20;
                }
                else {
                    points -= Number(cardValue);
                }
                wrong += 1
            }
        } else if (dropZone === topCenterDiv || dropZone === bottomCenterDiv) {
            draggableElement.style.backgroundColor = 'red';
            points = -10;
            if (['K', 'Q', 'J'].includes(cardValue)) {
                points = -20;
            }
            else {
                points -= Number(cardValue);
            }
            wrong += 1
        } else {
            highlightCurrentStack();
            return;
        }
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

    let currentCard = { value: cardValue, suit: cardSuit, index: cardIndex }
    await fetch('/api/event', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            eventName: 'Card Dropped',
            roundId,
            roundLevel,
            currentCard,
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
