"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const exportToPDF = (payoutDetails, totalPayout) => {
  const doc = new jsPDF();

  // Add title
  doc.text("Payout Report", 14, 20);
  
  // Add table headers
  doc.text("Author", 14, 30);
  doc.text("Articles", 60, 30);
  doc.text("Rate", 100, 30);
  doc.text("Payout", 140, 30);

  // Add table rows
  let yPosition = 40;
  payoutDetails.forEach((article) => {
    doc.text(article.author, 14, yPosition);
    doc.text(article.title, 60, yPosition);
    doc.text(`${article.rate}`, 100, yPosition);
    doc.text(article.payout, 140, yPosition);
    yPosition += 10;
  });

  // Add total payout
  doc.text(`Total Payout: ${totalPayout.toFixed(2)} USD`, 14, yPosition + 10);

  // Save the PDF
  doc.save("Payout_Report.pdf");
};

const exportToCSV = (payoutDetails, totalPayout) => {
  const rows = [
    ["Author", "Articles", "Rate", "Payout"], // Table headers
    ...payoutDetails.map((article) => [
      article.author,
      article.title,
      article.rate,
      article.payout,
    ]),
    ["Total Payout", "", "", `${totalPayout.toFixed(2)} USD`],
  ];

  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach((rowArray) => {
    const row = rowArray.join(",");
    csvContent += row + "\r\n";
  });

  // Create download link
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "Payout_Report.csv");
  link.click();
};

const exportToGoogleSheets = (payoutDetails, totalPayout) => {
  // Assuming you have an authenticated Google client
  const sheets = google.sheets("v4");

  // Prepare the data
  const rows = [
    ["Author", "Articles", "Rate", "Payout"],
    ...payoutDetails.map((article) => [
      article.author,
      article.title,
      article.rate,
      article.payout,
    ]),
    ["Total Payout", "", "", `${totalPayout.toFixed(2)} USD`],
  ];

  // Define the range and values to be updated in the Google Sheet
  sheets.spreadsheets.values.update({
    spreadsheetId: "your-spreadsheet-id",
    range: "Sheet1!A1", // Adjust as necessary
    valueInputOption: "RAW",
    resource: {
      values: rows,
    },
  });
};

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

  const payoutDetails = articles.map((article) => ({
    author: article.author,
    title: article.title,
    rate: payoutRates[article.author] || 0,
    payout: (payoutRates[article.author] || 0).toFixed(2),
  }));

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
              <td>{(payoutRates[article.author] || 0).toFixed(2)} USD</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Total Payout: {totalPayout.toFixed(2)} USD</h3>

      <button onClick={() => exportToPDF(payoutDetails, totalPayout)}>Export to PDF</button>
      <button onClick={() => exportToCSV(payoutDetails, totalPayout)}>Export to CSV</button>
      <button onClick={() => exportToGoogleSheets(payoutDetails, totalPayout)}>Export to Google Sheets</button>
    </div>
  );
}
