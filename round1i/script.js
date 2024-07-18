document.getElementById('nextPageButton').addEventListener('click', function() {
    document.body.classList.add('fade-out');
    const params = getQueryParams();
    const uniqueId = params.uniqueId;
    setTimeout(() => {
        window.location.href = `/round1/index.html?uniqueId=${uniqueId}`;
    }, 500); // Wait for the fade-out transition to complete
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

document.addEventListener('DOMContentLoaded', (event) => {
    const params = getQueryParams();
    const uniqueId = params.uniqueId;

    if (uniqueId) {
        console.log('Unique ID:', uniqueId);
        // Display the unique ID on the page
        document.getElementById('uniqueIdDisplay').textContent = `Unique ID: ${uniqueId}`;
        // You can now use the unique ID in your page
        // For example, you might use it in an API request
    } else {
        console.error('No unique ID found in the query string');
    }
});