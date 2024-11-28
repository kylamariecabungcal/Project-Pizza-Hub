const menu = document.querySelector('#product-list');

const getData = async () => {
    try {
        const response = await fetch("http://localhost:4000/api/products"); 
        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Error fetching product data:', err);
    }
};

const createCard = (menuItem) => {
    const col = document.createElement('div');
    const card = document.createElement('div');

    col.classList.add('col-sm-3', 'mb-4');
    card.classList.add('card', 'menu-item', 'product-card');

    card.append(createCardBody(menuItem));

    col.append(card);

    return col;
};

const createCardBody = (menuItem) => {
    const div = document.createElement('div');
    const h5 = document.createElement('h5');
    const p = document.createElement('p');
    const button = document.createElement('button');

    div.classList.add('card-body', 'text-center');
    h5.classList.add('card-title', 'text-white');
    p.classList.add('card-text', 'text-white');
    button.classList.add('btn', 'btn-order');

    h5.innerHTML = `${menuItem.name}`;
    p.innerText = `₱${menuItem.price}`;

    const img = document.createElement('img');
    img.src = `http://localhost:4000${menuItem.image}`; 
    img.classList.add('img-fluid', 'pizza');
    img.alt = "Product Image";
    img.style.width = '200px';  
    img.style.height = '200px';

    button.innerText = 'Buy Now';
    button.onclick = () => addToOrder(menuItem);

    div.append(img);
    div.append(h5);
    div.append(p);
    div.append(button);

    return div;
};

let orderItems = [];
let totalCost = 0;

function addToOrder(menuItem) {
    const existingItemIndex = orderItems.findIndex(item => item.name === menuItem.name);

    if (existingItemIndex !== -1) {
        orderItems[existingItemIndex].quantity += 1;
    } else {
        orderItems.push({
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            productId: menuItem._id
        });
    }

    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = ''; 
    totalCost = 0; 

    orderItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'bg-dark', 'text-white');
        listItem.innerHTML = `
            ${item.name} - ₱${item.price} x 
            <button class="btn btn-sm btn-light" onclick="adjustQuantity(${index}, -1)">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="btn btn-sm btn-light" onclick="adjustQuantity(${index}, 1)">+</button>
            <span> = ₱${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn btn-danger btn-sm float-end" onclick="removeItem(${index})">Remove</button>
        `;
        orderList.appendChild(listItem);

        totalCost += item.price * item.quantity;
    });

    document.getElementById('totalCost').innerText = totalCost.toFixed(2);
}

function adjustQuantity(index, change) {
    if (orderItems[index].quantity + change > 0) {
        orderItems[index].quantity += change;
    } else {
        orderItems[index].quantity = 1;
    }
    updateOrderSummary();
}

function removeItem(index) {
    orderItems.splice(index, 1);
    updateOrderSummary();
}

async function checkout() {
    if (orderItems.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Your order is empty',
            text: 'Please add items to the cart before proceeding.',
            confirmButtonText: 'Okay'
        });
        return;
    }

    const orderData = {
        orderDetails: orderItems.map(item => ({
            productId: item.productId,  
            quantity: item.quantity
        })),
        totalAmount: totalCost
    };

    try {
        const response = await fetch("http://localhost:4000/api/order/new", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Order placed successfully!',
                text: `Your order ID is: ${result._id}`,
                confirmButtonText: 'Great'
            }).then(() => {
                orderItems = [];
                totalCost = 0;
                updateOrderSummary();
            });
        } else {
            throw new Error(result.error || "Something went wrong during checkout.");
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message,
            confirmButtonText: 'Try Again'
        });
    }
}


getData().then(result => {
    if (result && result.length) {
        result.forEach(menuItem => {
            menu.append(createCard(menuItem));
        });
    }
}).catch(err => {
    console.log(err);
});

document.querySelector('.btn-success').addEventListener('click', checkout);
