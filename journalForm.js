
// Event Listener for the Submit Button
document.getElementById('journalForm').addEventListener('submit', submitForm);

function submitForm(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const mood = document.getElementById('mood').value;
    const rating = document.getElementById('rating').value;
    const joy = document.getElementById('joy').value;

    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mood, rating, joy }),
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); 
        alert('Form Submitted Successfully, Submit again to change your response!');
        document.getElementById('journalForm').reset(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    });
}

// Event listener for delete email button
document.getElementById('deleteEmailButton').addEventListener('click', function() {
    const email = document.getElementById('email').value;

    if (email) {
        if(confirm("Are you sure you want to delete your email and all your data from the database? (Please ensure your email is accurate)"))
        fetch('http://localhost:3000/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            alert('Email deleted successfully!');
            document.getElementById('journalForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the email.');
        });
    } else {
        alert('Please enter an email address to delete.');
    }
});



