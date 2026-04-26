// Web entry point for Kapda Thrift Bazaar
// This is a simple vanilla JS version that works in browsers

import { initializeApp } from './web/firebase-init.js';
import { setupRouter } from './web/router.js';
import { initializeUI } from './web/ui.js';

// Initialize Firebase
initializeApp();

// Setup routing
setupRouter();

// Initialize UI
initializeUI();

// Log startup
console.log('Kapda Thrift Bazaar Web App Started');
console.log('Visit http://localhost:3000 to see the app');
