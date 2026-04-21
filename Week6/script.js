  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
  import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyC0XYSKT_n834holaL4MeCFjdxID6uOJ9s",
    authDomain: "mobileprogramming-c5d8a.firebaseapp.com",
    projectId: "mobileprogramming-c5d8a",
    storageBucket: "mobileprogramming-c5d8a.firebasestorage.app",
    messagingSenderId: "894541779583",
    appId: "1:894541779583:web:a9e5babbf389bf2a68e54a"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

  console.log(db)

  function writeUserData(userId, firstname, lastname){
    set (ref (db, "users/" + userId), {
    firstname: firstname,
    lastname: lastname,
  });
}
writeUserData(1, "Elyana", "Sah");
writeUserData(2, "Aarya",  "Niraula");

