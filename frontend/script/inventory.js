const tableBody = document.querySelector('#example tbody');

// Fetch inventory data from your API endpoint
const getInventoryData = async () => {
    try {
        const response = await fetch("http://localhost:4000/api/inventories");
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Error fetching inventory data:', err);
    }
};

// Create table rows dynamically
const createTableRow = (productItem, index) => {
    // Access the actual product details from the product property
    const product = productItem.product;

    // Create a table row for each product
    const row = document.createElement('tr');

    // Create table cells and append them to the row
    const productIdCell = document.createElement('td');
    productIdCell.innerText = index + 1;  // Set the Product ID to the index (1-based)

    const productNameCell = document.createElement('td');
    productNameCell.innerText = product.name;  // Display the product name

    const priceCell = document.createElement('td');
    priceCell.innerText = `₱${product.price.toFixed(2)}`;  // Format and display the price

    const stockCell = document.createElement('td');
    stockCell.innerText = productItem.stock;  // Display the stock from the outer object

    const statusCell = document.createElement('td');
    statusCell.innerText = productItem.stock > 0 ? 'In Stock' : 'Out of Stock';  // Show in-stock status based on stock quantity

    const actionCell = document.createElement('td');

    // Create the Delete icon
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa', 'fa-trash', 'text-danger');
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.title = 'Delete Product';
    deleteIcon.addEventListener('click', () => deleteProduct(product.id));

    // Create the Edit icon
    const editIcon = document.createElement('i');
    editIcon.classList.add('fa', 'fa-edit', 'text-primary');
    editIcon.style.cursor = 'pointer';
    editIcon.title = 'Edit Product';
    editIcon.addEventListener('click', () => editProduct(product.id));

    // Append the icons to the action cell
    actionCell.appendChild(editIcon);
    actionCell.appendChild(document.createTextNode(' '));  // Add space between icons
    actionCell.appendChild(deleteIcon);

    // Append the cells to the row
    row.append(productIdCell, productNameCell, priceCell, stockCell, statusCell, actionCell);

    return row;
};

// Update the inventory table with the data
const updateInventoryTable = (products) => {
    // Clear the existing table rows
    tableBody.innerHTML = '';

    // Add each product as a new row in the table, passing the index
    products.forEach((productItem, index) => {
        const row = createTableRow(productItem, index);
        tableBody.appendChild(row);
    });
};

// Delete product function
const deleteProduct = async (id) => {
    try {
        const response = await fetch(`http://localhost:4000/api/inventories/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            Swal.fire('Success', 'Product deleted successfully!', 'success');
            // Refresh the inventory data after deletion
            getInventoryData().then(result => {
                if (result && result.length) {
                    updateInventoryTable(result);
                }
            });
        } else {
            Swal.fire('Error', 'Failed to delete product!', 'error');
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        Swal.fire('Error', 'An error occurred while deleting the product!', 'error');
    }
};

// Edit product function
const editProduct = (productId) => {
    window.location.href = `/edit-product.html?id=${productId}`;
};

// Fetch and display the inventory data when the page loads
getInventoryData().then(result => {
    if (result && result.length) {
        updateInventoryTable(result);
    }
}).catch(err => {
    console.log(err);
});