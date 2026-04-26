// Firebase contact form integration.
// If you don't want to hardcode keys, set `window.FIREBASE_CONFIG` before this module loads.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = window.FIREBASE_CONFIG || {
  apiKey: "AIzaSyCPOdf_AKaVYs2vu-Oo5mZFd_gc-la68n8",
  authDomain: "kapda-thrift-bazaar.firebaseapp.com",
  projectId: "kapda-thrift-bazaar",
  storageBucket: "kapda-thrift-bazaar.firebasestorage.app",
  messagingSenderId: "603041740029",
  appId: "1:603041740029:web:d6d37c182eb8e441057a94",
  measurementId: "G-X4XLGJ7F04"
};

let db = null;

function canUseFirebase(cfg) {
  return cfg && typeof cfg.apiKey === "string" && cfg.apiKey !== "YOUR_API_KEY";
}

try {
  if (canUseFirebase(firebaseConfig)) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized.");
  } else {
    console.warn("Firebase config not set. Contact form will be mocked.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  db = null;
}

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = (document.getElementById("contact-name")?.value || "").trim();
    const email = (document.getElementById("contact-email")?.value || "").trim();
    const message = (document.getElementById("contact-message")?.value || "").trim();
    const submitBtn = document.getElementById("submit-contact");

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const originalText = submitBtn?.innerText || "Send Message";
    if (submitBtn) {
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;
    }

    try {
      if (!db) {
        console.log("Mock contact submission:", { name, email, message });
        await new Promise((r) => setTimeout(r, 800));
        alert("Message sent successfully! (Mocked)");
      } else {
        const docRef = await addDoc(collection(db, "contacts"), {
          name,
          email,
          message,
          createdAt: new Date().toISOString()
        });
        console.log("Contact saved with ID:", docRef.id);
        alert("Message sent successfully!");
      }

      contactForm.reset();
    } catch (error) {
      console.error("Error saving contact:", error);
      alert("Error sending message. Please try again.");
    } finally {
      if (submitBtn) {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
    }
  });
});

