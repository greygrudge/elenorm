// ====== PRODUCT DATA (edit prices / names here) ======
const PRODUCTS = [
  {
    id: "free-palestine",
    name: "FREE PALESTINE – Drop Shoulder",
    price: 480,
    description: "220+ GSM premium cotton, unisex sizes M–XL.",
  },
  {
    id: "spider",
    name: "Spider Theme Collection Tee",
    price: 449,
    description: "Streetwear fit graphic tee.",
  },
  {
    id: "core-logo",
    name: "ELENORM Core Logo Tee",
    price: 420,
    description: "Minimal everyday logo tee.",
  },
  {
    id: "custom",
    name: "Custom Design Tee",
    price: 539,
    description: "Your own design printed on 220+ GSM cotton.",
  },
];

// ====== LOCAL STORAGE HELPERS ======
const CART_KEY = "elenorm_cart";

function loadCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ====== CART OPERATIONS ======
function addToCart(productId, qty = 1) {
  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  updateCartBadge();
  alert("Added to cart.");
}

function updateQuantity(productId, qty) {
  let cart = loadCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty = qty <= 0 ? 1 : qty;
  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

function removeFromCart(productId) {
  let cart = loadCart().filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  renderCartPage();
  updateCartBadge();
}

// ====== CART BADGE IN HEADER ======
function updateCartBadge() {
  const cart = loadCart();
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const badgeEls = document.querySelectorAll("[data-cart-count]");
  badgeEls.forEach((el) => {
    el.textContent = totalItems > 0 ? totalItems : "0";
  });
}

// ====== RENDER CART PAGE (cart.html) ======
function renderCartPage() {
  const tableBody = document.getElementById("cart-body");
  const subtotalEl = document.getElementById("cart-subtotal");
  const emptyEl = document.getElementById("cart-empty");
  if (!tableBody || !subtotalEl || !emptyEl) return;

  const cart = loadCart();
  tableBody.innerHTML = "";

  if (cart.length === 0) {
    emptyEl.style.display = "block";
    subtotalEl.textContent = "0 BDT";
    return;
  }

  emptyEl.style.display = "none";

  let subtotal = 0;

  cart.forEach((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return;
    const lineTotal = product.price * item.qty;
    subtotal += lineTotal;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price} BDT</td>
      <td>
        <input class="qty-input" type="number" min="1" value="${item.qty}" />
      </td>
      <td class="text-right">${lineTotal} BDT</td>
      <td><button class="btn-ghost" data-remove="${product.id}">✕</button></td>
    `;

    const qtyInput = tr.querySelector("input");
    qtyInput.addEventListener("change", (e) => {
      const value = parseInt(e.target.value, 10) || 1;
      updateQuantity(product.id, value);
    });

    const removeBtn = tr.querySelector("[data-remove]");
    removeBtn.addEventListener("click", () => removeFromCart(product.id));

    tableBody.appendChild(tr);
  });

  subtotalEl.textContent = `${subtotal} BDT`;
}

// ====== CHECKOUT PAGE SUMMARY (checkout.html) ======
function renderCheckoutSummary() {
  const list = document.getElementById("checkout-list");
  const totalEl = document.getElementById("checkout-total");
  if (!list || !totalEl) return;

  const cart = loadCart();
  list.innerHTML = "";
  if (cart.length === 0) {
    list.innerHTML = "<p class='muted'>Your cart is empty.</p>";
    totalEl.textContent = "0 BDT";
    return;
  }

  let subtotal = 0;
  cart.forEach((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return;
    const lineTotal = product.price * item.qty;
    subtotal += lineTotal;

    const p = document.createElement("p");
    p.textContent = `${item.qty} × ${product.name} — ${lineTotal} BDT`;
    list.appendChild(p);
  });

  const shipping = subtotal > 0 ? 80 : 0; // flat example shipping
  const total = subtotal + shipping;

  totalEl.textContent = `${total} BDT (incl. est. 80 BDT shipping)`;
}

// ====== CHECKOUT FORM SUBMIT ======
function handleCheckoutSubmit(e) {
  e.preventDefault();
  alert(
    "Checkout complete (demo).\nConnect this form to a real payment gateway later."
  );
  clearCart();
  window.location.href = "index.html";
}

// ====== HOME PAGE HELPERS ======
function bindHomeButtons() {
  // Attach add-to-cart to buttons with data-product-id
  document.querySelectorAll("[data-product-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-product-id");
      addToCart(id, 1);
    });
  });

  // Smooth scroll
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll");
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ====== INIT ON LOAD ======
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartPage();
  renderCheckoutSummary();

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) checkoutForm.addEventListener("submit", handleCheckoutSubmit);

  bindHomeButtons();
});
