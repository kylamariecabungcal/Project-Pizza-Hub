const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('product-list');
const tableBody = document.querySelector('#example tbody');

const sendData = async (data) => {
    const formData = new FormData();
    formData.append('image', data.image);
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('stock', data.stock);

    try {
        const response = await fetch('http://localhost:4000/api/products/new', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Error: Response not OK');
            Swal.fire({
                icon: 'error',
                title: 'Error Adding Product',
                text: 'Failed to add the product. Please try again later.',
            });
            return null;
        }
    } catch (error) {
        console.error("Error sending data:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error Adding Product',
            text: 'An error occurred while sending the data. Please try again.',
        });
    }
};

const addProductCard = (product) => {
    const col = document.createElement('div');
    const card = document.createElement('div');
    const cardBody = document.createElement('div');
    const img = document.createElement('img');
    const h5 = document.createElement('h5');
    const p = document.createElement('p');
    const button = document.createElement('button');

    col.classList.add('col-sm-3', 'mb-4');
    card.classList.add('card', 'product-card');
    cardBody.classList.add('card-body', 'text-center');
    
    img.src = product.image;
    img.classList.add('img-fluid', 'pizza');
    img.alt = "Product Image";
    h5.classList.add('card-title', 'text-white');
    p.classList.add('card-text', 'text-white');
    button.classList.add('btn', 'btn-order');

    h5.innerText = product.productName;
    p.innerText = `₱${product.price}`;
    button.innerText = 'Buy Now';

    cardBody.appendChild(img);
    cardBody.appendChild(h5);
    cardBody.appendChild(p);
    cardBody.appendChild(button);
    card.appendChild(cardBody);
    col.appendChild(card);

    productList.appendChild(col);
};

const updateStockOnServer = async (inventoryId, updatedStock) => {
    console.log("Inventory ID being sent to server:", inventoryId);

    try {
        const response = await fetch(`http://localhost:4000/api/inventories/${inventoryId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stock: updatedStock,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update stock');
        }

        const updatedData = await response.json();
        console.log('Updated inventory and product:', updatedData);
    } catch (error) {
        console.error('Error updating stock on the server:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while updating stock. Please try again.',
        });
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

    const stockContainer = document.createElement('div');
    stockContainer.classList.add('d-flex', 'align-items-center', 'justify-content-center');

    const decreaseButton = document.createElement('button');
    const stockDisplay = document.createElement('span');
    const increaseButton = document.createElement('button');
    
    decreaseButton.innerHTML = '<i class="fa fa-minus"></i>';
    increaseButton.innerHTML = '<i class="fa fa-plus"></i>';
    stockDisplay.innerText = productItem.stock || 0;
    
    decreaseButton.classList.add('btn', 'btn-sm', 'btn-danger', 'stock-button');
    increaseButton.classList.add('btn', 'btn-sm', 'btn-success', 'stock-button');
    
    stockDisplay.classList.add('mx-2', 'stock-value');

    stockContainer.appendChild(decreaseButton);
    stockContainer.appendChild(stockDisplay);
    stockContainer.appendChild(increaseButton);

    stockCell.appendChild(stockContainer);

    let stockActionConfirmed = false;

    decreaseButton.addEventListener('click', async () => {
        if (!stockActionConfirmed) {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'Are you sure you want to decrease the stock?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            });

            if (!confirmation.isConfirmed) {
                return;
            }
            
            stockActionConfirmed = true;
        }

        if (productItem.stock > 0) {
            productItem.stock--;
            stockDisplay.innerText = productItem.stock;
            await updateStockOnServer(productItem.inventoryId, productItem.stock);
        }
    });

    increaseButton.addEventListener('click', async () => {
        if (!stockActionConfirmed) {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: 'Are you sure you want to increase the stock?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            });

            if (!confirmation.isConfirmed) {
                return;
            }
            
            stockActionConfirmed = true;
        }

        productItem.stock++;
        stockDisplay.innerText = productItem.stock;
        await updateStockOnServer(productItem.inventoryId, productItem.stock);
    });

    const statusCell = document.createElement('td');
    let statusText = '';
    let statusClass = '';

    if (productItem.stock === 0) {
        statusText = 'Out of Stock';
        statusClass = 'text-danger';
    } else if (productItem.stock <= 10) {
        statusText = 'Low Stock';
        statusClass = 'text-warning';
    } else {
        statusText = 'In Stock';
        statusClass = 'text-success';
    }

    statusCell.innerText = statusText;
    statusCell.classList.add(statusClass);

    const actionCell = document.createElement('td');

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa', 'fa-trash', 'text-danger');
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.title = 'Delete Product';
    deleteIcon.addEventListener('click', () => deleteProduct(productItem.inventoryId));

    const editIcon = document.createElement('i');
    editIcon.classList.add('fa', 'fa-edit', 'text-primary');
    editIcon.style.cursor = 'pointer';
    editIcon.title = 'Edit Product';
    editIcon.addEventListener('click', () => editProduct(productItem.inventoryId));

    actionCell.appendChild(editIcon);
    actionCell.appendChild(document.createTextNode(' '));
    actionCell.appendChild(deleteIcon);

    row.append(productIdCell, productNameCell, priceCell, stockCell, statusCell, actionCell);

    return row;
};

const itemsPerPage = 12;
let currentPage = 1;
let allProducts = [];

const updateInventoryTable = (products) => {
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);

    pageProducts.forEach((productItem, index) => {
        const row = createTableRow(productItem, startIndex + index);
        if (row) {
            tableBody.appendChild(row);
        }
    });

    updatePaginationControls(products.length);
};

const updatePaginationControls = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerText = 'Previous';
    prevButton.classList.add('btn', 'btn-sm', 'btn-primary');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateInventoryTable(allProducts);
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'mx-1');
        pageButton.disabled = currentPage === i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            updateInventoryTable(allProducts);
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.innerText = 'Next';
    nextButton.classList.add('btn', 'btn-sm', 'btn-primary');
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateInventoryTable(allProducts);
        }
    });
    paginationContainer.appendChild(nextButton);
};

const getInventoryData = async () => {
    try {
        const response = await fetch("http://localhost:4000/api/inventories");
        const result = await response.json();
        allProducts = result.map(item => ({
            inventoryId: item._id,
            product: item.product,
            stock: item.stock,
        }));
        updateInventoryTable(allProducts);
    } catch (err) {
        console.error('Error fetching inventory data:', err);
    }
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

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productNameElement = document.getElementById('productName');
    const productPriceElement = document.getElementById('productPrice');
    const productImageElement = document.getElementById('productImage');
    const productStockElement = document.getElementById('stock');

    const product = {
        image: productImageElement.files[0],
        name: productNameElement.value.trim(),
        price: parseFloat(productPriceElement.value),
        stock: parseInt(productStockElement.value),
    };

    if (!product.name || isNaN(product.price) || isNaN(product.stock) || !product.image) {
        Swal.fire({
            icon: 'error',
            title: 'Missing Fields',
            text: 'Please fill in all required fields correctly.',
        });
        return;
    }

    sendData(product).then(result => {
        if (result && result.product && result.inventory) {
            Swal.fire({
                icon: "success",
                title: "Product Added Successfully!",
                text: "The new product has been added to the inventory.",
            }).then(() => {
                updateInventoryTable([result.inventory]);
                $('#addProductModal').modal('hide');
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error Adding Product",
                text: "There was an error adding the product. Please try again.",
            });
        }
    }).catch(e => {
        console.error("Error adding product:", e);
        Swal.fire({
            icon: "error",
            title: "Error Adding Product",
            text: "There was an error adding the product. Please try again.",
        });
    });
});
