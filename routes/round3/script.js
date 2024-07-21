const cardsData = [
    [{ value: '9', suit: 'checkmark' }, { value: '3', suit: 'spades' }, { value: 'K', suit: 'hearts' }, { value: 'Q', suit: 'diamonds' }, { value: '3', suit: 'checkmark' }],
    [{ value: '2', suit: 'checkmark' }, { value: '6', suit: 'checkmark' }, { value: '2', suit: 'diamonds' }, { value: '4', suit: 'diamonds' }, { value: '10', suit: 'checkmark' }],
    [{ value: 'K', suit: 'checkmark' }, { value: 'Q', suit: 'clubs' }, { value: '7', suit: 'checkmark' }, { value: '9', suit: 'diamonds' }, { value: 'J', suit: 'checkmark' }],
    [{ value: 'Q', suit: 'checkmark' }, { value: 'K', suit: 'hearts' }, { value: 'J', suit: 'hearts' }, { value: '7', suit: 'checkmark' }, { value: '6', suit: 'hearts' }],
    [{ value: '7', suit: 'checkmark' }, { value: '9', suit: 'clubs' }, { value: '3', suit: 'hearts' }, { value: '9', suit: 'clubs' }, { value: '2', suit: 'checkmark' }],
    [{ value: '10', suit: 'checkmark' }, { value: '7', suit: 'checkmark' }, { value: '5', suit: 'clubs' }, { value: '1', suit: 'clubs' }, { value: '3', suit: 'hearts' }]
]; 

let roundLevel = 3;

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
        if (dropZone === topCenterDiv || dropZone.closest('.top-center')) {
            if (['K', 'Q', 'J'].includes(cardValue)) {
                draggableElement.style.backgroundColor = 'green';
                points = 10;
                right += 1

            } else {
                draggableElement.style.backgroundColor = 'red';
                points = -10;
                wrong += 1
            }
        } else if (dropZone === bottomCenterDiv || dropZone.closest('.bottom-center')) {
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
        if (dropZone.closest('.symbol')) {
            const symbolSuit = dropZone.getAttribute('data-suit');
            if (cardSuit === symbolSuit) {
                draggableElement.style.backgroundColor = 'green';
                if (['K', 'Q', 'J'].includes(cardValue)) {
                    points = 10 + 10;
                }
                else {
                    points = 10 + Number(cardValue);
                }
                right += 1; // Correct symbol guessed
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
        } else if (dropZone === topCenterDiv || dropZone.closest('.top-center') || dropZone === bottomCenterDiv || dropZone.closest('.bottom-center')) {
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
    console.log('currentCard', currentCard)
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
