function convertToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
}
function startClock() {
    timerInterval = setInterval(() => {
        elapsedTime++;
        updateClock();
    }, 1000);
}

function stopClock() {
    clearInterval(timerInterval);
}

function updateClock() {
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    document.getElementById('clock').textContent = `${minutes}:${seconds}`;
}

function addTime(seconds) {
    elapsedTime += seconds;
    updateClock();
}