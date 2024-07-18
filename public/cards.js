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

function highlightCurrentStack() {
    document.querySelectorAll('.card').forEach(card => {
        card.style.borderColor = '#000'; // Reset border color for all cards
    });
    const currentCard = document.querySelector(`#card${currentStackIndex + 1}`);
    if (currentCard) {
        currentCard.style.borderColor = 'yellow';
    }
}

const suitEntities = {
    hearts: '&hearts;',
    spades: '&spades;',
    clubs: '&clubs;',
    diamonds: '&diams;',
    checkmark: '&#10003;'
};

async function loadInitialCards(cardsData) {
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

    await fetch('/api/event', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': document.cookie
        },
        body: JSON.stringify({
            eventName: 'Round Started',
            roundId,
            roundLevel,
            cardSet: JSON.stringify(cardsData),
            timestamp: new Date().toISOString()
        })
    });
}

function flipCard(card) {
    flips += 1;
    card.classList.toggle('purple');
    addTime(2);
}

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

    if (roundLevel == 3 && data.suit !== 'checkmark') {
        const flipButton = document.createElement('button');
        flipButton.textContent = 'Flip';
        flipButton.className = 'flip-button';
        flipButton.addEventListener('click', () => flipCard(card));
        card.appendChild(flipButton);
    }

    if (data.suit === 'checkmark') {
        spanSuit.style.color = 'transparent';
    } else if (data.suit === 'diamonds' || data.suit === 'hearts') {
        spanSuit.style.color = 'red';
    } else {
        spanSuit.style.color = 'black';
    }

    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);

    return card;
}

async function loadNextCard(cardIndex, placeholder) {
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
        setTimeout(() => {
            const suitElement = nextCard.querySelector('.suit');
            if (suitElement) {
                suitElement.style.color = 'transparent';
            }
        }, 3000);
    } else {
        placeholder.style.borderColor = 'black';
        placeholder.style.backgroundColor = 'transparent';
    }

    currentStackIndex = (currentStackIndex + 1) % cardsData.length;
    highlightCurrentStack();
    if (isGameOver()) {
        console.log('Game Over');
        stopClock();
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
        <div class="modal-content">
            <p>Please proceed to the next round</p>
            <a href="${roundLevel < 3 ? `/round${roundLevel + 1}i` : `/thank-you`}" id="nextRoundButton">Finish</a>
        </div>
    `;
        document.body.appendChild(modal);
        await fetch('/api/event', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': document.cookie
            },
            body: JSON.stringify({
                eventName: 'Round Ended',
                roundId,
                roundLevel,
                score,
                right,
                wrong,
                timestamp: new Date().toISOString()
            })
        });
    }
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

function isGameOver() {
    return cardsData.every(stack => stack.length === 0);
}