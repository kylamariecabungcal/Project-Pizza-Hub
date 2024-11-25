document.addEventListener('DOMContentLoaded', () => {
    const salesTableBody = document.querySelector('#salesTable');  // Corrected here
    const dateInput = document.getElementById('date');

    // Fetch sales data from your API endpoint
    const getSalesData = async (date = '') => {
        try {
            // Build query parameters based on the selected date
            const url = date ? `http://localhost:4000/api/sale?date=${date}` : 'http://localhost:4000/api/sale';
            const response = await fetch(url);
            const result = await response.json();
            return result;
        } catch (err) {
            console.error('Error fetching sales data:', err);
        }
    };

    // Create table rows dynamically
    const createSalesTableRow = (saleItem, index) => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.innerText = new Date(saleItem.date).toLocaleDateString();  // Format the date

        const productIdCell = document.createElement('td');
        productIdCell.innerText = saleItem.productId;

        const productNameCell = document.createElement('td');
        productNameCell.innerText = saleItem.productName;

        const quantitySoldCell = document.createElement('td');
        quantitySoldCell.innerText = saleItem.quantity;

        const salesAmountCell = document.createElement('td');
        salesAmountCell.innerText = `₱${saleItem.totalPrice.toFixed(2)}`;  // Format the sales amount

        // Append cells to the row
        row.append(dateCell, productIdCell, productNameCell, quantitySoldCell, salesAmountCell);

        return row;
    };

    // Update the sales table with data
    const updateSalesTable = (salesData) => {
        // Check if the table body exists before trying to update it
        if (salesTableBody) {
            // Clear the existing table rows
            salesTableBody.innerHTML = '';

            // Add each sale as a new row in the table
            salesData.forEach((saleItem, index) => {
                const row = createSalesTableRow(saleItem, index);
                salesTableBody.appendChild(row);
            });
        } else {
            console.error("Sales table body not found.");
        }
    };

    // Fetch and display sales data when the page loads or date is changed
    const loadSalesData = () => {
        const selectedDate = dateInput.value;
        getSalesData(selectedDate).then(result => {
            if (result && result.length) {
                updateSalesTable(result);
            }
        }).catch(err => {
            console.error('Error loading sales data:', err);
        });
    };

    // Event listener for date input to filter sales
    dateInput.addEventListener('change', loadSalesData);

    // Initial data load when the page loads
    loadSalesData();
});
