// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPOdf_AKaVYs2vu-Oo5mZFd_gc-la68n8",
  authDomain: "kapda-thrift-bazaar.firebaseapp.com",
  projectId: "kapda-thrift-bazaar",
  storageBucket: "kapda-thrift-bazaar.firebasestorage.app",
  messagingSenderId: "603041740029",
  appId: "1:603041740029:web:d6d37c182eb8e441057a94",
  measurementId: "G-X4XLGJ7F04"
};

// Initialize Firebase
let app, db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized (waiting for real config)");
} catch (error) {
    console.error("Firebase initialization failed:", error);
}

// Handle Contact Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            const submitBtn = document.getElementById('submit-contact');
            
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            try {
                // Mock behavior if Firebase is not actually configured
                if (firebaseConfig.apiKey === "YOUR_API_KEY") {
                    console.log("Mocking Firebase save for Contact Form:");
                    console.log({ name, email, message });
                    
                    // Simulate network request
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    alert("Message sent successfully! (Mocked)");
                } else {
                    // Actual Firebase call
                    const docRef = await addDoc(collection(db, "contacts"), {
                        name: name,
                        email: email,
                        message: message,
                        timestamp: new Date()
                    });
                    console.log("Document written with ID: ", docRef.id);
                    alert("Message sent successfully!");
                }
                
                // Clear form
                contactForm.reset();
                
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error sending message. Please try again.");
            } finally {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});
