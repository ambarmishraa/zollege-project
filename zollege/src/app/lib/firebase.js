import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwoiKxQqfo5GT886eS4SB24lXdwuROVCM",
    authDomain: "zollege-e219b.firebaseapp.com",
    projectId: "zollege-e219b",
    storageBucket: "zollege-e219b.firebasestorage.app",
    messagingSenderId: "883422274359",
    appId: "1:883422274359:web:f4b87f1501a0e28749f0b2"
  };

  const app = initializeApp(firebaseConfig); // Initialize Firebase app
  const auth = getAuth(app); // Get authentication instance
  const db = getFirestore(app); // Get Firestore instance
  
  export { auth, db };