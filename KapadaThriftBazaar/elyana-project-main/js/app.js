// Data Models
const products = [
    { id: 1, name: "White T-shirt", desc: "Premium white tee.", price: 15.00, imgClass: "", icon: "fa-shirt", type: "T-shirt", color: "White" },
    { id: 2, name: "Black T-shirt", desc: "Men black tee with cool look.", price: 20.00, imgClass: "dark", icon: "fa-shirt", type: "T-shirt", color: "Black" },
    { id: 3, name: "Summer Hat", desc: "Cool hat for summer.", price: 12.00, imgClass: "orange", icon: "fa-hat-cowboy", type: "Hats", color: "Orange" },
    { id: 4, name: "Red Dress", desc: "Elegant red dress.", price: 45.00, imgClass: "red", icon: "fa-person-dress", type: "Dresses", color: "Red" },
    { id: 5, name: "Blue Jeans", desc: "Comfortable denim jeans.", price: 35.00, imgClass: "blue", icon: "fa-socks", type: "Pants", color: "Blue" },
    { id: 6, name: "Sunglasses", desc: "UV protection.", price: 25.00, imgClass: "green", icon: "fa-glasses", type: "Accessories", color: "Black" }
];

let cart = [];
let orders = [];

// History stack for goBack functionality
let screenHistory = ['welcome-screen'];

window.navigateTo = function(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Push to history if it's not the current screen
        if (screenHistory[screenHistory.length - 1] !== screenId) {
            screenHistory.push(screenId);
        }
    }

    // Screen-specific rendering
    if (screenId === 'cart-screen') renderCart();
    if (screenId === 'checkout-screen') renderCheckoutTotal();
    if (screenId === 'orders-screen') renderOrders();
    if (screenId === 'search-screen') initSearchScreen();
}

window.goBack = function() {
    if (screenHistory.length > 1) {
        // Pop current screen
        screenHistory.pop();
        // Get previous screen
        const previousScreen = screenHistory[screenHistory.length - 1];
        
        // Hide all screens
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        // Show previous screen
        const targetScreen = document.getElementById(previousScreen);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
}

window.renderProducts = function(category = "New") {
    const productList = document.querySelector('.product-list');
    if (!productList) return;
    
    productList.innerHTML = '';
    
    let filteredProducts = products;
    if (category !== "New") {
        filteredProducts = products.filter(p => p.type === category || p.name.includes(category));
    }
    
    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-light);">No items found.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const itemHtml = `
            <div class="product-item" onclick="viewProduct(${product.id})">
                <div class="product-img ${product.imgClass}"><i class="fa-solid ${product.icon}"></i></div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="desc">${product.desc}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                </div>
                <div class="product-actions">
                    <button class="icon-btn-small" onclick="event.stopPropagation(); toggleHeart(this)"><i class="fa-regular fa-heart"></i></button>
                    <button class="icon-btn-small" onclick="event.stopPropagation(); addToCart(${product.id})"><i class="fa-solid fa-cart-shopping"></i></button>
                </div>
            </div>
        `;
        productList.innerHTML += itemHtml;
    });
}

window.viewProduct = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // update details screen
    const detailsScreen = document.getElementById('item-details-screen');
    if(detailsScreen) {
        const largeImg = detailsScreen.querySelector('.item-large-img');
        if(largeImg) largeImg.className = `item-large-img ${product.imgClass}`;
        
        const largeIcon = detailsScreen.querySelector('.item-large-img i');
        if(largeIcon) largeIcon.className = `fa-solid ${product.icon} fa-4x`;
        
        // Update details list
        const detailRows = detailsScreen.querySelectorAll('.detail-row span:last-child');
        if(detailRows.length >= 3) {
            detailRows[1].innerText = product.type;
            detailRows[2].innerText = product.color;
        }
    }
    
    navigateTo('item-details-screen');
}

window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        saveCart();
        updateCartBadge();
        alert(`${product.name} added to cart!`);
    }
}

function cartTotal() {
    return cart.reduce((sum, p) => sum + Number(p.price || 0), 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    try {
        const raw = localStorage.getItem('cart');
        cart = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch {
        cart = [];
    }
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function loadOrders() {
    try {
        const raw = localStorage.getItem('orders');
        orders = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(orders)) orders = [];
        // Automatically remove orders that don't have any items
        orders = orders.filter(o => o && Array.isArray(o.items) && o.items.length > 0);
    } catch {
        orders = [];
    }
}

function featuredProducts() {
    // Simple featured set: first 4 products
    return products.slice(0, 4);
}

window.renderFeatured = function() {
    const el = document.getElementById('featured-list');
    if (!el) return;
    const featured = featuredProducts();
    if (!featured.length) {
        el.innerHTML = '';
        return;
    }

    el.innerHTML = featured.map(p => `
        <div class="featured-card" onclick="viewProduct(${p.id})" role="button" tabindex="0">
            <div class="product-img ${p.imgClass || ''}"><i class="fa-solid ${p.icon || 'fa-shirt'}"></i></div>
            <div class="featured-info">
                <div class="name">${p.name}</div>
                <div class="price">$${Number(p.price || 0).toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

window.updateCartBadge = function() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = cart.length;
    if (count <= 0) {
        badge.style.display = 'none';
        badge.textContent = '0';
        return;
    }
    badge.style.display = 'inline-flex';
    badge.textContent = String(count);
}

window.removeFromCart = function(index) {
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCart();
}

window.clearCart = function() {
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
}

window.renderCart = function() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    if (!container || !summary) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 30px 10px; color: var(--text-light);">
                <p style="margin-bottom: 10px;">Your cart is empty.</p>
                <button class="btn btn-primary" onclick="navigateTo('dashboard-screen')">Browse Products</button>
            </div>
        `;
        summary.innerHTML = '';
        return;
    }

    container.innerHTML = cart.map((p, idx) => `
        <div class="product-item" style="cursor: default;">
            <div class="product-img ${p.imgClass || ''}"><i class="fa-solid ${p.icon || 'fa-shirt'}"></i></div>
            <div class="product-info">
                <h4>${p.name}</h4>
                <p class="desc">${p.desc || ''}</p>
                <p class="price">$${Number(p.price || 0).toFixed(2)}</p>
            </div>
            <div class="product-actions">
                <button class="icon-btn-small" onclick="removeFromCart(${idx})" title="Remove">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    summary.innerHTML = `
        <div style="display:flex; justify-content:space-between; padding: 14px 10px; border-top: 1px solid var(--border-color);">
            <span style="color: var(--text-light); font-weight: 600;">Total</span>
            <span style="color: var(--text-main); font-weight: 800;">$${cartTotal().toFixed(2)}</span>
        </div>
    `;
}

window.proceedToCheckout = function() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    navigateTo('checkout-screen');
}

window.renderCheckoutTotal = function() {
    const el = document.getElementById('checkout-total');
    if (!el) return;
    el.textContent = `Order Total: $${cartTotal().toFixed(2)}`;
}

window.placeOrder = function(payload) {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        navigateTo('dashboard-screen');
        return;
    }
    const order = {
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        items: [...cart],
        total: cartTotal(),
        customer: payload
    };
    orders.unshift(order);
    saveOrders();
    clearCart();
    alert(`Order placed successfully!\n${order.id}`);
    navigateTo('dashboard-screen');
}

window.renderOrders = function() {
    const el = document.getElementById('orders-list');
    if (!el) return;

    if (!orders.length) {
        el.innerHTML = `
            <div style="text-align:center; padding: 30px 10px; color: var(--text-light);">
                <p style="margin-bottom: 10px;">No orders yet.</p>
                <button class="btn btn-primary" onclick="navigateTo('dashboard-screen')">Start Shopping</button>
            </div>
        `;
        return;
    }

    el.innerHTML = orders.map(o => {
        const date = new Date(o.createdAt).toLocaleString();
        const itemsCount = Array.isArray(o.items) ? o.items.length : 0;
        return `
            <div class="product-item" style="cursor: default;">
                <div class="product-img"><i class="fa-solid fa-box"></i></div>
                <div class="product-info">
                    <h4>${o.id}</h4>
                    <p class="desc">${itemsCount} item(s) • ${date}</p>
                    <p class="price">$${Number(o.total || 0).toFixed(2)}</p>
                </div>
                <div class="product-actions" style="display: flex; gap: 5px;">
                    <button class="icon-btn-small" onclick="alert('Order: ${o.id}\\nItems: ${itemsCount}\\nTotal: $${Number(o.total || 0).toFixed(2)}')" title="View Receipt">
                        <i class="fa-solid fa-receipt"></i>
                    </button>
                    <button class="icon-btn-small" onclick="removeOrder('${o.id}')" title="Remove Order">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.removeOrder = function(orderId) {
    if(confirm('Are you sure you want to remove this order?')) {
        orders = orders.filter(o => o.id !== orderId);
        saveOrders();
        renderOrders();
    }
}

window.clearOrders = function() {
    if(confirm('Are you sure you want to clear all orders?')) {
        orders = [];
        saveOrders();
        renderOrders();
    }
}

window.toggleHeart = function(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        icon.style.color = 'var(--primary-color)';
        icon.style.transform = 'scale(1.2)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);
    } else {
        icon.classList.add('fa-regular');
        icon.classList.remove('fa-solid');
        icon.style.color = 'var(--text-light)';
    }
}

window.handleLogin = function(e) {
    e.preventDefault();
    localStorage.setItem('userLoggedIn', 'true');
    navigateTo('dashboard-screen');
}

window.logout = function() {
    const ok = confirm('Do you want to logout and exit?');
    if (!ok) return;
    localStorage.removeItem('userLoggedIn');
    navigateTo('welcome-screen');
    screenHistory = ['welcome-screen'];
}

// Alias if you want a separate "Exit" action later
window.exitApp = function() {
    logout();
}

window.openSearch = function() {
    navigateTo('search-screen');
}

window.openFilters = function() {
    alert('Filters are a UI placeholder in this demo.');
}

window.scrollFeatured = function(direction = 1) {
    const el = document.getElementById('featured-list');
    if (!el) return;
    const amount = Math.max(180, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: amount * direction, behavior: 'smooth' });
}

function searchProducts(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];
    return products.filter(p => {
        const hay = `${p.name} ${p.desc} ${p.type} ${p.color}`.toLowerCase();
        return hay.includes(q);
    });
}

window.renderSearchResults = function(query) {
    const el = document.getElementById('search-results');
    if (!el) return;
    const q = (query || '').trim();
    const matches = searchProducts(q);

    if (!q) {
        el.innerHTML = `<p style="color: var(--text-light); padding: 10px 0;">Start typing to search.</p>`;
        return;
    }

    if (!matches.length) {
        el.innerHTML = `<p style="color: var(--text-light); padding: 10px 0;">No results found.</p>`;
        return;
    }

    el.innerHTML = matches.map(p => `
        <div class="product-item" onclick="viewProduct(${p.id})">
            <div class="product-img ${p.imgClass || ''}"><i class="fa-solid ${p.icon || 'fa-shirt'}"></i></div>
            <div class="product-info">
                <h4>${p.name}</h4>
                <p class="desc">${p.desc || ''}</p>
                <p class="price">$${Number(p.price || 0).toFixed(2)}</p>
            </div>
            <div class="product-actions">
                <button class="icon-btn-small" onclick="event.stopPropagation(); addToCart(${p.id})" title="Add to cart">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.initSearchScreen = function() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.oninput = () => renderSearchResults(input.value);
    if (!input.value) renderSearchResults('');
    setTimeout(() => input.focus(), 0);
}

function loadProfile() {
    try {
        const raw = localStorage.getItem('profile');
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveProfile(profile) {
    localStorage.setItem('profile', JSON.stringify(profile || {}));
}

window.toggleNotif = function(key) {
    const raw = localStorage.getItem('notifPrefs');
    let prefs = {};
    try { prefs = raw ? JSON.parse(raw) : {}; } catch { prefs = {}; }
    prefs[key] = !(prefs[key] ?? true);
    localStorage.setItem('notifPrefs', JSON.stringify(prefs));
    applyNotifPrefs();
}

function applyNotifPrefs() {
    const raw = localStorage.getItem('notifPrefs');
    let prefs = {};
    try { prefs = raw ? JSON.parse(raw) : {}; } catch { prefs = {}; }
    const keys = ['orderUpdates', 'promos'];
    keys.forEach(k => {
        const on = prefs[k] ?? true;
        const el = document.getElementById(`notif-${k}`);
        if (el) el.textContent = on ? 'On' : 'Off';
    });
}

// Initialization and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadOrders();
    updateCartBadge();

    // Check login status
    if (localStorage.getItem('userLoggedIn') === 'true') {
        navigateTo('dashboard-screen');
    }
    
    // Initial Render
    renderProducts();
    renderFeatured();
    applyNotifPrefs();

    // Category button toggle logic
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active from all
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            // Re-render
            renderProducts(e.target.innerText);
        });
    });

    const paymentBtns = document.querySelectorAll('.pay-method-btn');
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Forms setup
    const loginForm = document.getElementById('login-form');
    if(loginForm) loginForm.onsubmit = handleLogin;
    
    const signupForm = document.getElementById('signup-form');
    if(signupForm) signupForm.onsubmit = handleLogin;

    const profile = loadProfile();
    const pn = document.getElementById('profile-name');
    const pe = document.getElementById('profile-email');
    const pp = document.getElementById('profile-phone');
    if (pn) pn.value = profile.name || 'John Doe';
    if (pe) pe.value = profile.email || 'johndoe@example.com';
    if (pp) pp.value = profile.phone || '';

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const next = {
                name: (document.getElementById('profile-name')?.value || '').trim(),
                email: (document.getElementById('profile-email')?.value || '').trim(),
                phone: (document.getElementById('profile-phone')?.value || '').trim()
            };
            saveProfile(next);
            alert('Saved!');
            goBack();
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('checkout-name')?.value?.trim() || '',
                phone: document.getElementById('checkout-phone')?.value?.trim() || '',
                address: document.getElementById('checkout-address')?.value?.trim() || '',
                payment: document.getElementById('checkout-payment')?.value || 'Cash on delivery'
            };
            if (!payload.name || !payload.phone || !payload.address) {
                alert('Please fill in all checkout fields.');
                return;
            }
            placeOrder(payload);
            checkoutForm.reset();
        });
    }
});
