"use client";

import { useState, useEffect } from "react";

export default function PayoutComponent({ articles }) {
  const [payoutRates, setPayoutRates] = useState({});
  const [totalPayout, setTotalPayout] = useState(0);

  useEffect(() => {
    // Load payout rates from localStorage if available
    const storedRates = JSON.parse(localStorage.getItem("payoutRates")) || {};
    setPayoutRates(storedRates);
  }, []);

  useEffect(() => {
    // Save payout rates to localStorage whenever they change
    localStorage.setItem("payoutRates", JSON.stringify(payoutRates));
  }, [payoutRates]);

  useEffect(() => {
    // Calculate total payout
    const total = articles.reduce((sum, article) => {
      const rate = payoutRates[article.author] || 0;
      return sum + rate;
    }, 0);
    setTotalPayout(total);
  }, [articles, payoutRates]);

  const handleRateChange = (author, rate) => {
    setPayoutRates((prevRates) => ({
      ...prevRates,
      [author]: parseFloat(rate) || 0,
    }));
  };

  return (
    <div>
      <h2>Payout Calculator</h2>
      <table>
        <thead>
          <tr>
            <th>Author</th>
            <th>Articles</th>
            <th>Rate</th>
            <th>Payout</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.author}</td>
              <td>{article.title}</td>
              <td>
                <input
                  type="number"
                  value={payoutRates[article.author] || ""}
                  onChange={(e) =>
                    handleRateChange(article.author, e.target.value)
                  }
                />
              </td>
              <td>
                {(payoutRates[article.author] || 0).toFixed(2)} USD
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Payout: {totalPayout.toFixed(2)} USD</h3>
    </div>
  );
}
