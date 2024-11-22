const addProductForm = document.getElementById('addProductForm');
const productList = document.getElementById('product-list');

const sendData = async (data) => {
    const formData = new FormData();
    formData.append('image', data.image); 
    formData.append('productName', data.name); 
    formData.append('price', data.price); 

    const response = await fetch('http://localhost:4000/api/products/new', {
        method: 'POST',
        body: formData, 
    });

    const result = await response.json();
    return result;
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

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const product = {
        image: document.getElementById('productImage').files[0],
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
    };

    sendData(product).then(result => {
        console.log(result);  
        if (result && result.productName && result.price) {
        
            Swal.fire({
                icon: "success",
                title: "Product Added Successfully!",
                text: "The new product has been added to the menu.",
            }).then(() => {
                
                addProductCard(result);
                
                $('#addProductModal').modal('hide');
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error Adding Product",
                text: "The response from the server was not as expected.",
            });
        }
    }).catch(e => {
        Swal.fire({
            icon: "error",
            title: "Error Adding Product",
            text: "There was an error adding the product. Please try again.",
        });

        console.error(e);  
    });
});
