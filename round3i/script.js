document.getElementById('nextPageButton').addEventListener('click', function() {
    document.body.classList.add('fade-out');
    const params = getQueryParams();
    const uniqueId = params.uniqueId;
    setTimeout(() => {
        window.location.href = `/round3/index.html?uniqueId=${uniqueId}`;
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