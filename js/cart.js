
let cart = [];
let cartCount = document.getElementById("cart-count");
let cartTotal = document.getElementById("cart-total");
let cartItems = document.getElementById("cart-items");
let cartDropdown = document.getElementById("cart-dropdown");
let clearCartButton = document.getElementById("clear-cart");


function addToCart(productId, productName, productPrice, size) {
    let existingProduct = cart.find(item => item.id === productId && item.size === size);

    if (existingProduct) {
        existingProduct.quantity += 1; 
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            size: size,
            quantity: 1
        });
    }

    updateCart();
}


function updateCart() {
   
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

    
    let total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);

    
    cartItems.innerHTML = "";
    cart.forEach(item => {
        let cartItem = document.createElement("li");
        cartItem.innerHTML = `
            ${item.name} (${item.size}) x${item.quantity} - ${item.price * item.quantity} Lei
            <button class="adjust-quantity" data-id="${item.id}" data-size="${item.size}" data-action="minus">-</button>
            <button class="adjust-quantity" data-id="${item.id}" data-size="${item.size}" data-action="plus">+</button>
        `;
        cartItems.appendChild(cartItem);
    });

   
    document.querySelectorAll('.adjust-quantity').forEach(button => {
        button.addEventListener('click', (event) => {
            let action = event.target.getAttribute('data-action');
            let productId = event.target.getAttribute('data-id');
            let size = event.target.getAttribute('data-size');
            adjustQuantity(productId, size, action);
        });
    });
}


function adjustQuantity(productId, size, action) {
    let product = cart.find(item => item.id === productId && item.size === size);

    if (product) {
        if (action === "plus") {
            product.quantity += 1;
        } else if (action === "minus" && product.quantity > 1) {
            product.quantity -= 1;
        }
    }

    updateCart();
}


function toggleCart() {
    cartDropdown.style.display = cartDropdown.style.display === "block" ? "none" : "block";
}


clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCart();
});


document.getElementById("cart-icon").addEventListener("click", toggleCart);


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        let productId = button.getAttribute('data-product');
        let productName = button.getAttribute('data-name');
        let productPrice = button.getAttribute('data-price');
        let size = button.closest('.box').querySelector('.size.active')?.dataset.size;

        if (!size) {
            alert("Alegeți o mărime!");
            return;
        }

        addToCart(productId, productName, productPrice, size);
    });
});




document.querySelectorAll('.size').forEach(sizeElement => {
    sizeElement.addEventListener('click', () => {
        
        sizeElement.parentElement.querySelectorAll('.size').forEach(s => s.classList.remove('active'));

       
        sizeElement.classList.add('active');
    });
});

window.onload = () => {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
    }
};


function addToCart(productId, productName, productPrice, size) {
    let existingProduct = cart.find(item => item.id === productId && item.size === size);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            size: size,
            quantity: 1
        });
    }

    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}


function adjustQuantity(productId, size, action) {
    let product = cart.find(item => item.id === productId && item.size === size);

    if (product) {
        if (action === "plus") {
            product.quantity += 1;
        } else if (action === "minus" && product.quantity > 1) {
            product.quantity -= 1;
        }

      
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    updateCart();
}


clearCartButton.addEventListener("click", () => {
    cart = [];
   
    localStorage.removeItem('cart');
    updateCart();
});
