// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQgzPJxwF50ktbFcGnId1f7FxJMsbaS6A",
  authDomain: "contact-form-2d59c.firebaseapp.com",
  projectId: "contact-form-2d59c",
  storageBucket: "contact-form-2d59c.firebasestorage.app",
  messagingSenderId: "118496162813",
  appId: "1:118496162813:web:00b19fb9c6eeae341c1f94",
  measurementId: "G-6RRB9VFE7Q"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// Form submit
const form = document.getElementById("contactForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  try {
    const newMessageRef = ref(db, 'messages/' + Date.now());
    await set(newMessageRef, {
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    });
    document.getElementById("successMsg").innerText = "Message sent successfully!";
    form.reset();
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("successMsg").innerText = "Error sending message!";
  }
});