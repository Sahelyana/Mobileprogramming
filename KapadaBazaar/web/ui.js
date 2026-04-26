// UI Initialization and utilities

export function initializeUI() {
  // Add global styles
  addGlobalStyles();
  
  // Initialize event listeners
  setupEventListeners();
  
  console.log('UI Initialized');
}

function addGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background-color: #F5F5F5;
      color: #212121;
    }
    
    * {
      box-sizing: border-box;
    }
    
    a {
      color: #C62828;
      text-decoration: none;
      cursor: pointer;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    button {
      cursor: pointer;
      border: none;
      font-family: inherit;
    }
    
    input, textarea, select {
      font-family: inherit;
    }
  `;
  document.head.appendChild(style);
}

function setupEventListeners() {
  // Handle hash-based routing
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1) || '/';
    const { handleRoute } = require('./router.js');
    handleRoute(hash);
  });
}

export function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'error' ? '#C62828' : '#4CAF50'};
    color: white;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
