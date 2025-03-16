const body = document.querySelector("body");
const modal = document.querySelector(".modal");
const modalButton = document.querySelector(".modal-button");
const closeButton = document.querySelector(".close-button");
const scrollDown = document.querySelector(".scroll-down");
let isOpened = false;

const openModal = () => {
  modal.classList.add("is-open");
  body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.remove("is-open");
  body.style.overflow = "initial";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight / 3 && !isOpened) {
    isOpened = true;
    scrollDown.style.display = "none";
    openModal();
  }
});

let cart = [];
let cartCount = document.getElementById("cart-count");
let cartTotal = document.getElementById("cart-total");
let cartItems = document.getElementById("cart-items");
let cartDropdown = document.getElementById("cart-dropdown");
let clearCartButton = document.getElementById("clear-cart");

function updateCart() {
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.style.display = cart.length > 0 ? "inline-block" : "none";

  let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
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

  document.querySelectorAll(".adjust-quantity").forEach(button => {
    button.addEventListener("click", (event) => {
      let action = event.target.getAttribute("data-action");
      let productId = event.target.getAttribute("data-id");
      let size = event.target.getAttribute("data-size");
      adjustQuantity(productId, size, action);
    });
  });

  localStorage.setItem("cart", JSON.stringify(cart));
}

function adjustQuantity(productId, size, action) {
  let product = cart.find(item => item.id === productId && item.size === size);
  if (product) {
    if (action === "plus") {
      product.quantity += 1;
    } else if (action === "minus" && product.quantity > 1) {
      product.quantity -= 1;
    } else if (action === "minus" && product.quantity === 1) {
      cart = cart.filter(item => !(item.id === productId && item.size === size));
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

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    let productId = button.getAttribute("data-product");
    let productName = button.getAttribute("data-name");
    let productPrice = parseFloat(button.getAttribute("data-price"));
    let size = button.closest(".box").querySelector(".size.active")?.dataset.size;

    if (!size) {
      alert("Alegeți o mărime!");
      return;
    }

    addToCart(productId, productName, productPrice, size);
  });
});

document.querySelectorAll(".size").forEach(sizeElement => {
  sizeElement.addEventListener("click", () => {
    sizeElement.parentElement.querySelectorAll(".size").forEach(s => s.classList.remove("active"));
    sizeElement.classList.add("active");
  });
});

window.onload = () => {
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
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
      price: productPrice,
      size: size,
      quantity: 1
    });
  }
  updateCart();
}
