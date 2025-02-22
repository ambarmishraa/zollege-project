// NewsComponent.js

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import styles from '../page.module.css';
import { useRouter } from "next/navigation";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function NewsComponent() {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [author, setAuthor] = useState("");
    const [type, setType] = useState("");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const NEWS_API_URL = `https://newsapi.org/v2/everything?q=technology&apiKey=005bdbe6abd0402c941d21f572ef25ee`;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(NEWS_API_URL);
                setArticles(response.data.articles);
                setFilteredArticles(response.data.articles); // Initialize filtered articles
            } catch (error) {
                console.error("Error fetching articles:", error);
                setErrorMessage("Failed to load articles. The API is not reachable. Please try again later.");
            }
        };
        fetchArticles();
    }, []);

    const router = useRouter();

    const handleLogout = () => {
        router.push("/");
    };
    
    const handlePayout = () => {
        router.push("/payout");
    };
    
    const applyFilters = () => {
        let filtered = [...articles];

        // Filter by author
        if (author) {
            filtered = filtered.filter((article) =>
                article.author?.toLowerCase().includes(author.toLowerCase())
            );
        }

        // Filter by type
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

    // Function to generate chart data for article trends by type
    const generateTypeChartData = () => {
        const typeCount = filteredArticles.reduce((acc, article) => {
            const articleType = article.type || "Unknown";
            acc[articleType] = acc[articleType] ? acc[articleType] + 1 : 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(typeCount),
            datasets: [
                {
                    label: "Articles by Type",
                    data: Object.values(typeCount),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    };

    // Function to generate chart data for article trends by author (Pie Chart)
    const generateAuthorChartData = () => {
        const authorCount = filteredArticles.reduce((acc, article) => {
            const articleAuthor = article.author || "Unknown";
            acc[articleAuthor] = acc[articleAuthor] ? acc[articleAuthor] + 1 : 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(authorCount),
            datasets: [
                {
                    label: "Articles by Author",
                    data: Object.values(authorCount),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    // Function to generate chart data for articles over time (Line Chart)
    const generateTimeChartData = () => {
        const dateCount = filteredArticles.reduce((acc, article) => {
            const articleDate = new Date(article.publishedAt).toDateString();
            acc[articleDate] = acc[articleDate] ? acc[articleDate] + 1 : 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(dateCount),
            datasets: [
                {
                    label: "Articles Over Time",
                    data: Object.values(dateCount),
                    fill: false,
                    backgroundColor: "rgba(75, 192, 192, 1)",
                    borderColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.1,
                },
            ],
        };
    };

    return (
        <div className={styles.productListing}>
            <h1 style={{ paddingBottom: "20px", display: "flex", justifyContent: "center", paddingTop: "20px" }}>News and Blogs</h1>
            <div style={{ display: "flex", justifyContent: "space-evenly", paddingBottom: "20px", cursor: "pointer" }}>
                <h5 onClick={handleLogout}>Logout</h5>
                <h5 onClick={handlePayout}>PayOut Calculator</h5>
            </div>

            {/* Error Message Display */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            {/* Multiple Charts */}
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div className={styles.articleChart}>
                    {!errorMessage && (
                        <div className={styles.chartCss}>
                            <h2>Article Trends by Type</h2>
                            <Bar data={generateTypeChartData()} options={{ responsive: true }} />
                        </div>
                    )}

                    {!errorMessage && (
                        <div className={styles.chartPie}>
                            <h2>Article Trends</h2>
                            <Pie
                                data={generateAuthorChartData()}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false, // Hides the legend
                                        },
                                        tooltip: {
                                            enabled: false, // Disables tooltips
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}

                    {!errorMessage && (
                        <div className={styles.chartCss}>
                            <h2>Articles Over Time</h2>
                            <Line data={generateTimeChartData()} options={{ responsive: true }} />
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filter}  >
                <input
                    style={{ borderRadius: "10px", backgroundColor: "white", border: "none", padding: "10px",color:"black" }}
                    type="text"
                    placeholder="Search by Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <input
                    style={{ borderRadius: "10px", backgroundColor: "white", border: "none", padding: "10px",color:"black"  }}
                    type="text"
                    placeholder="Search by Type (e.g., news, blog)"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                />
                <input
                    style={{ borderRadius: "10px", border: "none", padding: "10px"  }}
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <input
                    style={{ borderRadius: "10px", border: "none", padding: "10px", }}
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
                <input
                    style={{ borderRadius: "10px", backgroundColor: "white", border: "none", padding: "10px" ,color:"black" }}
                    type="text"
                    placeholder="Search by Keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button style={{ borderRadius: "10px", backgroundColor: "white", border: "none", padding: "10px", color: "black" }} onClick={applyFilters}>Apply Filters</button>
            </div>


            {/* Articles */}
            <div className={styles.articles}>
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article, index) => (
                        <div
                            key={index}
                            className={styles.articlesBox}
                        >
                            <h3 style={{ marginBottom: "10px" }}>{article.title}</h3>
                            <p style={{ marginBottom: "10px" }}>{article.description}</p>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Author:</strong> {article.author || "Unknown"}
                            </p>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Date:</strong> {new Date(article.publishedAt).toDateString()}
                            </p>
                            <p style={{ marginBottom: "5px" }}>
                                <strong>Type:</strong> {article.type || "News"}
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
