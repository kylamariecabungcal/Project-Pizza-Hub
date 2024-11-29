document.addEventListener('DOMContentLoaded', function () {
    async function fetchSalesData() {
        const response = await fetch('http://localhost:4000/api/sale');
        const data = await response.json();

        if (response.ok) {
            const salesData = processSalesData(data.totalSalesPerDay);
            renderSalesChart(salesData);
            
            const pizzaSalesData = processPizzaSalesData(data.totalSalesPerPizzaPerDay);
            renderPieChart(pizzaSalesData);
        } else {
            console.error('Error fetching sales data:', data.error);
        }
    }

    function processSalesData(sales) {
        const salesByDay = {};

        sales.forEach(sale => {
            const saleDate = sale._id;
            const saleInPHP = sale.totalSalesAmount;

            if (salesByDay[saleDate]) {
                salesByDay[saleDate] += saleInPHP;
            } else {
                salesByDay[saleDate] = saleInPHP;
            }
        });

        const days = Object.keys(salesByDay);
        const totalSales = Object.values(salesByDay);

        const sortedDays = days.sort((a, b) => new Date(a) - new Date(b));
        const sortedSales = sortedDays.map(day => salesByDay[day]);

        return { days: sortedDays, totalSales: sortedSales };
    }

    function processPizzaSalesData(pizzaSales) {
        const pizzaSalesByDay = {};

        pizzaSales.forEach(sale => {
            const pizzaName = sale._id.pizza;
            const saleInPHP = sale.totalSalesAmount;
            const saleDate = sale._id.date;

            if (!pizzaSalesByDay[saleDate]) {
                pizzaSalesByDay[saleDate] = {};
            }

            if (pizzaSalesByDay[saleDate][pizzaName]) {
                pizzaSalesByDay[saleDate][pizzaName] += saleInPHP;
            } else {
                pizzaSalesByDay[saleDate][pizzaName] = saleInPHP;
            }
        });

        return pizzaSalesByDay;
    }

    function renderSalesChart(salesData) {
        const ctx = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: salesData.days,
                datasets: [{
                    label: 'Total Sales (in PHP)',
                    data: salesData.totalSales,
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.2)',
                    fill: true,
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 5,
                    pointBackgroundColor: '#4e73df',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        },
                        grid: {
                            display: true
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total Sales (PHP)'
                        },
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₱' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItem) {
                                return '₱' + tooltipItem.raw.toLocaleString();
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    function renderPieChart(pizzaSalesData) {
        const latestDay = Object.keys(pizzaSalesData)[0];
        const pizzaSales = pizzaSalesData[latestDay];

        const pizzaNames = Object.keys(pizzaSales);
        const salesAmounts = Object.values(pizzaSales);

        const ctx = document.getElementById('pieChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: pizzaNames,
                datasets: [{
                    data: salesAmounts,
                    backgroundColor: [
                        '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC300', 
                        '#8E44AD', '#1ABC9C', '#F39C12', '#E74C3C'
                    ],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return '₱' + tooltipItem.raw.toLocaleString();
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    fetchSalesData();
});
document.addEventListener('DOMContentLoaded', function () {
    
   
    async function fetchLowStockProducts() {
        try {
            
            const response = await fetch('http://localhost:4000/api/inventories'); 
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            const lowStockThreshold = 5; 
            const lowStockProducts = data.filter(product => product.stock <= lowStockThreshold);

            renderLowStockProducts(lowStockProducts); 
        } catch (error) {
            console.error('Error fetching low stock products:', error);
            alert('Failed to load low stock products');
        }
    }

   
    function renderLowStockProducts(lowStockProducts) {
        const tbody = document.getElementById('low-stock-products');
        tbody.innerHTML = ''; 

        if (lowStockProducts.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="2">No low stock products</td>';
            tbody.appendChild(row);
        } else {
           
            lowStockProducts.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.stock}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    
    fetchLowStockProducts();

});

