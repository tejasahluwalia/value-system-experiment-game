async function submitForm(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }
    const uniqueId = crypto.randomUUID();


    const formData = {
        uniqueId: uniqueId,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value,
        city: document.getElementById("city").value,
        gender: document.getElementById("gender").value
    };


    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(
        document.body.classList.add('fade-out')
    )
    .catch((error) => {
        console.error('Error:', error);
    });
    setTimeout(() => {
        window.location.href = `/round1i/index.html?uniqueId=${uniqueId}`;
    }, 500) // Wait for the fade-out transition to complete

}

function validateForm() {
    let isValid = true;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const city = document.getElementById("city").value;
    const gender = document.getElementById("gender").value;

    if (name === "") {
        document.getElementById("nameError").innerText = "Name is required.";
        isValid = false;
    } else {
        document.getElementById("nameError").innerText = "";
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (email === "" || !email.match(emailPattern)) {
        document.getElementById("emailError").innerText = "Valid email is required.";
        isValid = false;
    } else {
        document.getElementById("emailError").innerText = "";
    }

    if (age === "" || isNaN(age) || age <= 0) {
        document.getElementById("ageError").innerText = "Valid age is required.";
        isValid = false;
    } else {
        document.getElementById("ageError").innerText = "";
    }

    if (city === "") {
        document.getElementById("cityError").innerText = "City is required.";
        isValid = false;
    } else {
        document.getElementById("cityError").innerText = "";
    }

    if (gender === "") {
        document.getElementById("genderError").innerText = "Gender is required.";
        isValid = false;
    } else {
        document.getElementById("genderError").innerText = "";
    }

    return isValid;
}