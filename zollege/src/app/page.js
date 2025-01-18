"use client"; // Ensure that this is at the top

import { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { db } from "./lib/firebase"; // Import your Firebase setup
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Correct import for the app directory
import styles from "./page.module.css"; 

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([
    // Sample articles (replace with actual fetched data)
    { id: 1, title: "Breaking News", author: "John Doe", type: "News" },
    { id: 2, title: "Tech Trends", author: "Jane Smith", type: "Blog" },
  ]);

  const router = useRouter(); // Initialize the router

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Query the 'users' collection to check if the user already exists by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User already exists, proceed to next step
        const userDoc = querySnapshot.docs[0]; // Get the first document matching the query
        console.log("User already exists:", userDoc.data());
        setMessage("Welcome back!");

        // Redirect to the News page on successful login
        router.push("/components"); // Adjusted path
      } else {
        // User does not exist, create a new user document with the email
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName,
          createdAt: new Date(),
        });
        console.log("New user created:", user);
        setMessage("Account created successfully!");

        // Redirect to the News page on successful login
        router.push("/component/news"); // Adjusted path
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.dashboard}>Ready For Ride</h1>
      <div className={styles.signButton}>
      <button className={styles.buttonSign} onClick={handleGoogleSignIn}>
        <img src="/google.png" alt="Google Sign In" className={styles.buttonImage} />
      </button>
      </div>
      <p>{message}</p>
      
      {/* You can still display the NewsComponent in the current page if you want */}
      {/* <NewsComponent /> */}

      {/* Payout Component */}
      {/* <PayoutComponent articles={articles} /> */}
    </div>
  );
}
