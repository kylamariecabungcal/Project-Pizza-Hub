const tableBody = document.querySelector('#example tbody');

const getInventoryData = async () => {
    try {
        const response = await fetch("http://localhost:4000/api/inventories");
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Error fetching inventory data:', err);
        return [];
    }
};


const createTableRow = (productItem, index) => {
    const product = productItem.product;

    if (!product) {
        return null;
    }

    
    const row = document.createElement('tr');


    const productIdCell = document.createElement('td');
    productIdCell.innerText = index + 1;  

    const productNameCell = document.createElement('td');
    
    productNameCell.innerText = product.name || 'Unnamed Product';

    const priceCell = document.createElement('td');
    
    priceCell.innerText = product.price ? `₱${product.price.toFixed(2)}` : '₱0.00';

    const stockCell = document.createElement('td');
    stockCell.innerText = productItem.stock || 0;  

    const statusCell = document.createElement('td');
    statusCell.innerText = productItem.stock > 0 ? 'In Stock' : 'Out of Stock';

    const actionCell = document.createElement('td');

    
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa', 'fa-trash', 'text-danger');
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.title = 'Delete Product';
    deleteIcon.addEventListener('click', () => deleteProduct(productItem.product?.id));

    
    const editIcon = document.createElement('i');
    editIcon.classList.add('fa', 'fa-edit', 'text-primary');
    editIcon.style.cursor = 'pointer';
    editIcon.title = 'Edit Product';
    editIcon.addEventListener('click', () => editProduct(productItem.product?.id));

    
    actionCell.appendChild(editIcon);
    actionCell.appendChild(document.createTextNode(' '));  
    actionCell.appendChild(deleteIcon);

    
    row.append(productIdCell, productNameCell, priceCell, stockCell, statusCell, actionCell);

    return row;
};


const updateInventoryTable = (products) => {
    
    tableBody.innerHTML = '';

    products.forEach((productItem, index) => {
        const row = createTableRow(productItem, index);
        if (row) {
            tableBody.appendChild(row);
        }
    });
};

const deleteProduct = async (id) => {
    try {
        const response = await fetch(`http://localhost:4000/api/inventories/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            Swal.fire('Success', 'Product deleted successfully!', 'success');
            
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


const editProduct = (productId) => {
    window.location.href = `/edit-product.html?id=${productId}`;
};


getInventoryData().then(result => {
    if (result && result.length) {
        updateInventoryTable(result);
    } else {
        console.error('No inventory data found');
    }
}).catch(err => {
    console.error(err);
});
