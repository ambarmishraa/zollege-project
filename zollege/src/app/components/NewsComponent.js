"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function NewsComponent() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const NEWS_API_URL = `https://newsapi.org/v2/everything?q=technology&apiKey=005bdbe6abd0402c941d21f572ef25ee`;

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await axios.get(NEWS_API_URL);
      setArticles(response.data.articles);
      setFilteredArticles(response.data.articles); // Initialize filtered articles
    };
    fetchArticles();
  }, []);

  // Filter function
  const applyFilters = () => {
    let filtered = [...articles];

    // Filter by author
    if (author) {
      filtered = filtered.filter((article) =>
        article.author?.toLowerCase().includes(author.toLowerCase())
      );
    }

    // Filter by type (assuming 'type' is in the API response, e.g., blogs or news)
    if (type) {
      filtered = filtered.filter((article) =>
        article.type?.toLowerCase() === type.toLowerCase()
      );
    }

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter((article) => {
        const articleDate = new Date(article.publishedAt);
        return (
          articleDate >= new Date(dateRange.start) &&
          articleDate <= new Date(dateRange.end)
        );
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  return (
    <div>
      <h1>News and Blogs</h1>

      {/* Filters */}
      <div>
        <input
          type="text"
          placeholder="Search by Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Type (e.g., news, blog)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange({ ...dateRange, start: e.target.value })
          }
        />
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) =>
            setDateRange({ ...dateRange, end: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Search by Keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {/* Articles */}
      <div>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <p>
                <strong>Author:</strong> {article.author || "Unknown"}
              </p>
              <p>
                <strong>Date:</strong> {new Date(article.publishedAt).toDateString()}
              </p>
              <p>
                <strong>Type:</strong> {article.type || "News"} {/* Adjust based on API */}
              </p>
            </div>
          ))
        ) : (
          <p>No articles found.</p>
        )}
      </div>
    </div>
  );
}
