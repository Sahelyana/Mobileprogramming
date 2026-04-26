// Firebase Web SDK v9+ Initialization
// Using CDN - no npm required

const firebaseConfig = {
  apiKey: "AIzaSyCPOdf_AKaVYs2vu-Oo5mZFd_gc-la68n8",
  authDomain: "kapda-thrift-bazaar.firebaseapp.com",
  databaseURL: "https://kapda-thrift-bazaar-default-rtdb.firebaseio.com",
  projectId: "kapda-thrift-bazaar",
  storageBucket: "kapda-thrift-bazaar.firebasestorage.app",
  messagingSenderId: "603041740029",
  appId: "1:603041740029:web:d6d37c182eb8e441057a94",
  measurementId: "G-X4XLGJ7F04"
};

export function initializeApp() {
  console.log('Firebase Config Loaded:', firebaseConfig.projectId);
  // Firebase will be initialized via CDN in index.html
  return firebaseConfig;
}

export const firebaseConfig;
