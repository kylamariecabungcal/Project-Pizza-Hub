function fetchData() {
    // Get the selected date from the date picker
    var selectedDate = document.getElementById('datepicker').value;
    
    if (selectedDate) {
        // Make an AJAX request to the server to fetch data for the selected date
        fetch('/getData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: selectedDate })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response for debugging
            displayData(data); // Function to display the data on the page
        })
        .catch(error => console.error('Error:', error));
    }
}

function displayData(data) {
    const dataContainer = document.getElementById('data-container');
    
    // Clear previous data
    dataContainer.innerHTML = '';
    
    // If data is found, display it
    if (data.length > 0) {
        data.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `Item: ${item.name}, Date: ${item.date}`; // Customize this to match your data
            dataContainer.appendChild(div);
        });
    } else {
        dataContainer.textContent = 'No data available for this date.';
    }
}
