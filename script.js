let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Added to cart");
}

function loadCart() {
    const cartList = document.getElementById('cart-items');
    const totalBox = document.getElementById('total');

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <p>${item.name}</p>
            <p>$${item.price}</p>
            <button onclick="removeItem(${index})" class="btn">Remove</button>
        `;
        cartList.appendChild(div);
        total += item.price;
    });

    totalBox.innerText = "$" + total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function checkout() {
    localStorage.removeItem('cart');
    alert("Order submitted! (Connect EmailJS later)");
}
