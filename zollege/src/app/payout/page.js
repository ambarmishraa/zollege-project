// src/app/payout/page.js

"use client";  // Marking the entire page as a client component

import { useEffect, useState } from "react";
import PayoutComponent from "./PayoutComponent";  // Import from the same folder

const PayoutPage = () => {
  // Sample articles data (you can replace this with your actual data fetching logic)
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch or load the articles (or pass them as props if they come from elsewhere)
    // For the sake of the example, I'll use hardcoded data:
    const sampleArticles = [
      { id: 1, author: "Jay Peters", title: "Article 1" },
      { id: 2, author: "Matthew Gault", title: "Article 2" },
      { id: 3, author: "Kyle Barr", title: "Article 3" },
    ];

    setArticles(sampleArticles);
  }, []);

  return (
    <div style={{background: "linear-gradient(45deg, #ffcc00, #ff9966)",width:"100%",height:"100vh"}} >
      <h1 style={{display:"flex", justifyContent:"center",padding:"40px 0px",color:"black"}}>Payout Management</h1>
      <PayoutComponent articles={articles} />
    </div>
  );
};

export default PayoutPage;
