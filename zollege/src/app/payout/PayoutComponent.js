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

  // Inline styles object
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      color:"black",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    th: {
      padding: "12px",
      textAlign: "left",
      backgroundColor: "#007bff",
      color: "white",
      fontSize: "16px",
    },
    td: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
    },
    trEven: {
      backgroundColor: "#f9f9f9",
    },
    input: {
      padding: "6px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      width: "100px",
      fontSize: "14px",
    },
    inputFocus: {
      outline: "none",
      borderColor: "#007bff",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "10px 15px",
      fontSize: "14px",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "20px",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    totalPayout: {
      marginTop: "20px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Payout Calculator</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Author</th>
            <th style={styles.th}>Articles</th>
            <th style={styles.th}>Rate</th>
            <th style={styles.th}>Payout</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} style={article.id % 2 === 0 ? styles.trEven : {}}>
              <td style={styles.td}>{article.author}</td>
              <td style={styles.td}>{article.title}</td>
              <td style={styles.td}>
                <input
                  type="number"
                  style={styles.input}
                  value={payoutRates[article.author] || ""}
                  onChange={(e) =>
                    handleRateChange(article.author, e.target.value)
                  }
                />
              </td>
              <td style={styles.td}>{(payoutRates[article.author] || 0).toFixed(2)} USD</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.totalPayout}>
        <h3>Total Payout: {totalPayout.toFixed(2)} USD</h3>
      </div>

      <div style={{display: "flex", justifyContent: "space-between"}}>
        <button style={styles.button} onClick={() => exportToPDF(payoutDetails, totalPayout)}>
          Export to PDF
        </button>
        <button style={styles.button} onClick={() => exportToCSV(payoutDetails, totalPayout)}>
          Export to CSV
        </button>
        <button style={styles.button} onClick={() => exportToGoogleSheets(payoutDetails, totalPayout)}>
          Export to Google Sheets
        </button>
      </div>
    </div>
  );
}
