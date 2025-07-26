// src/components/NewsCard.jsx
import React from "react";

const NewsCard = ({ article }) => {
  const { title, description, url, urlToImage, publishedAt, source } = article;

  return (
    <div className="news-card">
      <img src={urlToImage || "/placeholder.jpg"} alt={title} />
      <div className="news-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <small>
          {source.name} - {new Date(publishedAt).toLocaleDateString()}
        </small>
        <a href={url} target="_blank" rel="noopener noreferrer">
          Read More →
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
