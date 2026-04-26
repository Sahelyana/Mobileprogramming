// Simple Router for SPA navigation

const routes = {
  '/': 'home',
  '/home': 'home',
  '/search': 'search',
  '/sell': 'sell',
  '/chats': 'chats',
  '/profile': 'profile',
  '/login': 'login',
  '/register': 'register',
  '/product': 'product',
};

export function setupRouter() {
  const app = document.getElementById('root');
  
  // Create navigation
  const nav = createNavigation();
  app.innerHTML = '';
  app.appendChild(nav);
  
  // Create main content area
  const main = document.createElement('main');
  main.id = 'main-content';
  app.appendChild(main);
  
  // Handle initial route
  handleRoute(window.location.pathname);
  
  // Handle route changes
  window.addEventListener('popstate', () => {
    handleRoute(window.location.pathname);
  });
}

function createNavigation() {
  const nav = document.createElement('nav');
  nav.className = 'navigation';
  nav.innerHTML = `
    <div class="nav-container">
      <div class="nav-logo">
        <a href="#/" onclick="navigateTo('/')">Kapda Bazaar</a>
      </div>
      <div class="nav-links">
        <a href="#/" onclick="navigateTo('/')" class="nav-item" data-route="/">🏠 Home</a>
        <a href="#/search" onclick="navigateTo('/search')" class="nav-item" data-route="/search">🔍 Search</a>
        <a href="#/sell" onclick="navigateTo('/sell')" class="nav-item" data-route="/sell">➕ Sell</a>
        <a href="#/chats" onclick="navigateTo('/chats')" class="nav-item" data-route="/chats">💬 Chats</a>
        <a href="#/profile" onclick="navigateTo('/profile')" class="nav-item" data-route="/profile">👤 Profile</a>
      </div>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    .navigation {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }
    
    .nav-logo a {
      font-size: 1.5rem;
      font-weight: bold;
      color: #C62828;
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
    }
    
    .nav-item {
      text-decoration: none;
      color: #212121;
      font-weight: 500;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s;
    }
    
    .nav-item:hover,
    .nav-item.active {
      background: #EF9A9A;
      color: #C62828;
    }
    
    @media (max-width: 768px) {
      .nav-links {
        gap: 1rem;
        font-size: 0.9rem;
      }
      
      .nav-item {
        padding: 0.4rem 0.6rem;
      }
    }
  `;
  
  document.head.appendChild(style);
  return nav;
}

export function navigateTo(path) {
  window.history.pushState({}, '', `#${path}`);
  handleRoute(path);
}

function handleRoute(path) {
  const main = document.getElementById('main-content');
  const route = path.split('/')[1] || 'home';
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-route') === ('/' + route || '/')) {
      item.classList.add('active');
    }
  });
  
  // Render content
  switch (route) {
    case 'search':
      main.innerHTML = createSearchPage();
      break;
    case 'sell':
      main.innerHTML = createSellPage();
      break;
    case 'chats':
      main.innerHTML = createChatsPage();
      break;
    case 'profile':
      main.innerHTML = createProfilePage();
      break;
    case 'login':
      main.innerHTML = createLoginPage();
      break;
    case 'register':
      main.innerHTML = createRegisterPage();
      break;
    case 'home':
    default:
      main.innerHTML = createHomePage();
      break;
  }
}

function createHomePage() {
  return `
    <div class="page-container home-page">
      <section class="hero">
        <h1>Welcome to Kapda Thrift Bazaar</h1>
        <p>Buy and sell pre-loved fashion items with ease</p>
        <div class="hero-buttons">
          <button onclick="navigateTo('/search')" class="btn btn-primary">Start Shopping</button>
          <button onclick="navigateTo('/sell')" class="btn btn-secondary">Start Selling</button>
        </div>
      </section>
      
      <section class="featured">
        <h2>Featured Products</h2>
        <div class="products-grid">
          <div class="product-card">
            <div class="product-image">👗</div>
            <h3>Designer Dress</h3>
            <p class="price">₹999</p>
            <button class="btn btn-small">View Details</button>
          </div>
          <div class="product-card">
            <div class="product-image">👔</div>
            <h3>Casual Shirt</h3>
            <p class="price">₹599</p>
            <button class="btn btn-small">View Details</button>
          </div>
          <div class="product-card">
            <div class="product-image">👖</div>
            <h3>Jeans</h3>
            <p class="price">₹749</p>
            <button class="btn btn-small">View Details</button>
          </div>
          <div class="product-card">
            <div class="product-image">👠</div>
            <h3>Shoes</h3>
            <p class="price">₹1199</p>
            <button class="btn btn-small">View Details</button>
          </div>
        </div>
      </section>
      
      <style>
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .hero {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #C62828 0%, #FF8F00 100%);
          color: white;
          border-radius: 12px;
          margin-bottom: 3rem;
        }
        
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .featured h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #212121;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .product-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .product-image {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .product-card h3 {
          margin-bottom: 0.5rem;
          color: #212121;
        }
        
        .price {
          font-size: 1.5rem;
          color: #C62828;
          font-weight: bold;
          margin: 1rem 0;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .btn-primary {
          background: #C62828;
          color: white;
        }
        
        .btn-primary:hover {
          background: #8B1A1A;
        }
        
        .btn-secondary {
          background: #FFC107;
          color: #212121;
        }
        
        .btn-secondary:hover {
          background: #FF8F00;
        }
        
        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          background: #C62828;
          color: white;
          width: 100%;
        }
        
        .btn-small:hover {
          background: #8B1A1A;
        }
      </style>
    </div>
  `;
}

function createSearchPage() {
  return `
    <div class="page-container">
      <h1>Search Products</h1>
      <div class="search-container">
        <input type="text" placeholder="Search for items..." class="search-input">
        <button class="btn btn-primary">Search</button>
      </div>
      <p>Search functionality coming soon...</p>
      <style>
        .page-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .search-container { display: flex; gap: 1rem; margin: 2rem 0; }
        .search-input { flex: 1; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .search-input:focus { outline: none; border-color: #C62828; }
      </style>
    </div>
  `;
}

function createSellPage() {
  return `
    <div class="page-container">
      <h1>Sell Your Items</h1>
      <form class="sell-form">
        <div class="form-group">
          <label>Product Title</label>
          <input type="text" placeholder="Enter product title" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea placeholder="Describe your product" rows="4" required></textarea>
        </div>
        <div class="form-group">
          <label>Price</label>
          <input type="number" placeholder="Enter price" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select required>
            <option>Select category</option>
            <option>Clothing</option>
            <option>Shoes</option>
            <option>Accessories</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">List Item</button>
      </form>
      <style>
        .page-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .sell-form { max-width: 600px; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #C62828; }
      </style>
    </div>
  `;
}

function createChatsPage() {
  return `
    <div class="page-container">
      <h1>Messages</h1>
      <div class="chats-container">
        <div class="chat-item">
          <div class="chat-avatar">👤</div>
          <div class="chat-info">
            <h3>Seller Name</h3>
            <p>Last message...</p>
          </div>
          <span class="chat-time">2h ago</span>
        </div>
      </div>
      <style>
        .page-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .chats-container { max-width: 600px; }
        .chat-item { display: flex; gap: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; margin-bottom: 0.5rem; }
        .chat-item:hover { background: #f5f5f5; }
        .chat-avatar { font-size: 2rem; }
        .chat-info { flex: 1; }
        .chat-time { color: #999; font-size: 0.9rem; }
      </style>
    </div>
  `;
}

function createProfilePage() {
  return `
    <div class="page-container">
      <h1>My Profile</h1>
      <div class="profile-container">
        <div class="profile-header">
          <div class="profile-avatar">👤</div>
          <div class="profile-info">
            <h2>User Name</h2>
            <p>user@example.com</p>
            <button class="btn btn-secondary" onclick="navigateTo('/login')">Edit Profile</button>
          </div>
        </div>
        <div class="profile-stats">
          <div class="stat">
            <h3>15</h3>
            <p>Items Listed</p>
          </div>
          <div class="stat">
            <h3>8</h3>
            <p>Items Sold</p>
          </div>
          <div class="stat">
            <h3>4.8⭐</h3>
            <p>Rating</p>
          </div>
        </div>
      </div>
      <style>
        .page-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .profile-container { background: white; padding: 2rem; border-radius: 12px; }
        .profile-header { display: flex; gap: 2rem; margin-bottom: 2rem; }
        .profile-avatar { font-size: 4rem; }
        .profile-info h2 { margin: 0; color: #212121; }
        .profile-info p { color: #757575; margin: 0.5rem 0; }
        .profile-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .stat { text-align: center; }
        .stat h3 { font-size: 1.5rem; color: #C62828; margin: 0; }
        .stat p { color: #757575; margin: 0.5rem 0 0 0; }
      </style>
    </div>
  `;
}

function createLoginPage() {
  return `
    <div class="page-container auth-page">
      <div class="auth-container">
        <h1>Login</h1>
        <form>
          <div class="form-group">
            <input type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Password" required>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <p class="auth-link">Don't have account? <a href="#" onclick="navigateTo('/register')">Register here</a></p>
        </form>
      </div>
      <style>
        .page-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .auth-page { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); }
        .auth-container { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .auth-container h1 { text-align: center; margin-bottom: 2rem; color: #C62828; }
        .form-group { margin-bottom: 1rem; }
        .form-group input { width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; }
        .auth-link { text-align: center; margin-top: 1rem; color: #757575; }
        .auth-link a { color: #C62828; text-decoration: none; }
      </style>
    </div>
  `;
}

function createRegisterPage() {
  return `
    <div class="page-container auth-page">
      <div class="auth-container">
        <h1>Register</h1>
        <form>
          <div class="form-group">
            <input type="text" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <input type="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input type="tel" placeholder="Phone" required>
          </div>
          <div class="form-group">
            <input type="password" placeholder="Password" required>
          </div>
          <button type="submit" class="btn btn-primary">Register</button>
          <p class="auth-link">Already have account? <a href="#" onclick="navigateTo('/login')">Login here</a></p>
        </form>
      </div>
      <style>
        .page-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .auth-page { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); }
        .auth-container { background: white; padding: 2rem; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .auth-container h1 { text-align: center; margin-bottom: 2rem; color: #C62828; }
        .form-group { margin-bottom: 1rem; }
        .form-group input { width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 6px; }
        .auth-link { text-align: center; margin-top: 1rem; color: #757575; }
        .auth-link a { color: #C62828; text-decoration: none; }
      </style>
    </div>
  `;
}

// Make navigateTo globally accessible
window.navigateTo = navigateTo;
