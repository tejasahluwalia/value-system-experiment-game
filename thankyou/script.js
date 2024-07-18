document.getElementById('submitButton').addEventListener('click', function() {
    const feedback = document.getElementById('feedback').value;
    console.log('Feedback:', feedback);
    const params = getQueryParams();
    const uniqueId = params.uniqueId;
    
    const data = {
        uniqueId:uniqueId,
        feedback:feedback
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
    alert('Feedback submitted');
    // Remove the submit button
    const submitButton = document.getElementById('submitButton');
    submitButton.parentNode.removeChild(submitButton);
    document.body.classList.add('fade-out');
});


function getQueryParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    urlParams.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}