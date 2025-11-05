import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "af4ca0c5d99a4c7287859f8a54d52a1d"; // 🔑 Replace with your key
const PAGE_SIZE = 10;

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false); // login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("india");
  const [loading, setLoading] = useState(false);

  // Simple login check
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setLoggedIn(true);
    } else {
      alert("Invalid username or password!");
    }
  };

  // Fetch news based on category
  const fetchNews = async () => {
    setLoading(true);
    let url = "";

    if (category === "india") {
      url = `https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`;
    } else {
      url = `https://newsapi.org/v2/everything?q=latest&language=en&sortBy=publishedAt&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.articles) {
        setArticles((prev) => [...prev, ...data.articles]);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
    }
    setLoading(false);
  };

  // Reset when category changes
  useEffect(() => {
    setArticles([]);
    setPage(1);
  }, [category]);

  // Fetch when page or category changes
  useEffect(() => {
    if (loggedIn) fetchNews();
    // eslint-disable-next-line
  }, [page, category, loggedIn]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If not logged in → show login page
  if (!loggedIn) {
    return (
      <div className="login-container">
        <h1>🔐 Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // If logged in → show news feed
  return (
    <div className="container">
      <h1 className="heading">📰 News Feed</h1>

      {/* Logout */}
      <button
        style={{ float: "right", marginBottom: "20px" }}
        onClick={() => setLoggedIn(false)}
      >
        Logout
      </button>

      {/* Toggle Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setCategory("india")}
          className={category === "india" ? "btn active" : "btn"}
        >
          India News
        </button>
        <button
          onClick={() => setCategory("world")}
          className={category === "world" ? "btn active" : "btn"}
        >
          World News
        </button>
      </div>

      {/* News Articles */}
      {articles.map((article, index) => (
        <div key={index} className="card">
          {article.urlToImage && (
            <img src={article.urlToImage} alt="news" className="news-img" />
          )}
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More →
          </a>
        </div>
      ))}

      {loading && <h3 className="loading">Loading...</h3>}
    </div>
  );
}
