// src/App.jsx
import React, { useEffect, useState } from "react";
import NewsCard from "./component/NewsCard";
import "./App.css";

const API_KEY = "f45cc84b65c64c69aa50e9289ba12811";

const App = () => {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState("latest");
  const [category, setCategory] = useState("general");
  const [country, setCountry] = useState("us");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("publishedAt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = async () => {
    setLoading(true);
    setError("");

    try {
      const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&q=${query}&pageSize=12&page=${page}&apiKey=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status !== "ok") {
        throw new Error(data.message);
      }

      setArticles(data.articles || []);
    } catch (err) {
      setError(err.message);
      setArticles([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, [category, country, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // reset to first page
    fetchNews();
  };

  const clearSearch = () => {
    setQuery("");
    setPage(1);
    fetchNews();
  };

  return (
    <div className="app">
      <header>
        <h1>📰 React News App</h1>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search news..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={clearSearch} style={{ background: "#999" }}>
            Clear
          </button>
        </form>

        {/* Country & Sort */}
        <div className="filters">
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="us">🇺🇸 United States</option>
            <option value="in">🇮🇳 India</option>
            <option value="gb">🇬🇧 UK</option>
            <option value="au">🇦🇺 Australia</option>
            <option value="ca">🇨🇦 Canada</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="publishedAt">🕒 Latest</option>
            <option value="relevancy">📌 Relevance</option>
            <option value="popularity">🔥 Popularity</option>
          </select>
        </div>

        <div className="categories">
          {["general", "business", "technology", "sports", "health", "entertainment"].map((cat) => (
            <button
              key={cat}
              className={cat === category ? "active" : ""}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <h2 style={{ textAlign: "center" }}>Loading news...</h2>
      ) : error ? (
        <h2 style={{ color: "red", textAlign: "center" }}>Error: {error}</h2>
      ) : articles.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No news found.</h2>
      ) : (
        <>
          <div className="news-grid">
            {articles.map((article, idx) => (
              <NewsCard key={idx} article={article} />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            {page > 1 && (
              <button onClick={() => setPage((prev) => prev - 1)} style={{ marginRight: "10px" }}>
                ⬅ Prev
              </button>
            )}
            <button onClick={() => setPage((prev) => prev + 1)}>Next ➡</button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
