// Define the labels (pizza flavors) for the Line chart
const labels = [
    'Cheese',
    'Pepperoni',
    'Hawaiian',
    'Beef Deluxe',
    'Creamy Spinach',
    'Ham & Bacon',
    'Beef Supreme',
    'Chicken Alfredo',
    'Triple Pepperoni'
];

// Define the data for the Line chart
const data = {
    labels: labels,
    datasets: [{
        label: 'Pizza Flavor Popularity',
        data: [75, 90, 60, 50, 70, 85, 80, 65, 95], // Example data for each flavor
        fill: true, // Enable shading under the line
        borderColor: 'rgb(255, 205, 86)', // Yellow color for the line
        backgroundColor: 'rgba(255, 205, 86, 0.2)', // Light yellow for the shading
        tension: 0.1 // Curve tension for smooth lines
    }]
};

// Define the configuration for the Line chart
const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,  // Ensure chart is responsive
        maintainAspectRatio: false,  // Allow chart to break aspect ratio
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: true, // Automatically skips some ticks if they overlap
                    maxRotation: 0, // Keeps the x-axis labels horizontal
                    minRotation: 0
                },
                min: 0,
                max: labels.length - 1
            },
            y: {
                beginAtZero: true // Ensures the y-axis starts at zero
            }
        }
    }
};

// Initialize the Line chart
const myChart = new Chart(
    document.getElementById('myChart'), // Connect to the line chart canvas element
    config
);

// Define the labels (pizza flavors) for the Pie chart
const pieLabels = [
    'Cheese', 'Pepperoni', 'Hawaiian', 'Beef Deluxe', 
    'Creamy Spinach', 'Ham & Bacon', 'Beef Supreme', 
    'Chicken Alfredo', 'Triple Pepperoni'
];

// Define the data for the Pie chart
const pieData = {
    labels: pieLabels,
    datasets: [{
        label: 'Pizza Flavor Popularity',
        data: [120, 150, 100, 80, 90, 110, 130, 140, 160], // Example popularity data
        backgroundColor: [
            'rgba(255, 99, 132, 0.8)',  // Red
            'rgba(54, 162, 235, 0.8)',  // Blue
            'rgba(255, 206, 86, 0.8)',  // Yellow
            'rgba(75, 192, 192, 0.8)',  // Green
            'rgba(153, 102, 255, 0.8)', // Purple
            'rgba(255, 159, 64, 0.8)',  // Orange
            'rgba(199, 199, 199, 0.8)', // Grey
            'rgba(100, 255, 100, 0.8)', // Light Green
            'rgba(255, 128, 192, 0.8)'  // Pink
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',    // Red
            'rgba(54, 162, 235, 1)',    // Blue
            'rgba(255, 206, 86, 1)',    // Yellow
            'rgba(75, 192, 192, 1)',    // Green
            'rgba(153, 102, 255, 1)',   // Purple
            'rgba(255, 159, 64, 1)',    // Orange
            'rgba(199, 199, 199, 1)',   // Grey
            'rgba(100, 255, 100, 1)',   // Light Green
            'rgba(255, 128, 192, 1)'    // Pink
        ],
        borderWidth: 1
    }]
};

// Define the configuration for the Pie chart
const pieConfig = {
    type: 'pie',
    data: pieData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'left', // Legend position (top, left, bottom, right)
                labels: {
                    boxWidth: 20, // Width of the color box
                    padding: 10,  // Space between legend items
                    usePointStyle: true, // Makes the legend items use a circular point style
                },
            },
            tooltip: {
                enabled: true
            }
        }
    }
};

// Initialize the Pie chart
const myPieChart = new Chart(
    document.getElementById('pieChart'),
    pieConfig
);
