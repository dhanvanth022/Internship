const API_KEY = "f45cc84b65c64c69aa50e9289ba12811";
const searchInput = document.getElementById("searchInput");
const countrySelect = document.getElementById("countrySelect");
const sortSelect = document.getElementById("sortSelect");
const categoriesDiv = document.getElementById("categories");
const newsContainer = document.getElementById("newsContainer");
const searchForm = document.getElementById("searchForm");
const clearBtn = document.getElementById("clearBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let query = "";
let country = "us";
let category = "general";
let sortBy = "publishedAt";
let page = 1;

async function fetchNews() {
  newsContainer.innerHTML = "<h2>Loading news...</h2>";
  let url = "";

  if (query.trim() === "") {
    url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=12&page=${page}&apiKey=${API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=${sortBy}&pageSize=12&page=${page}&apiKey=${API_KEY}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") throw new Error(data.message);
    if (data.articles.length === 0) {
      newsContainer.innerHTML = "<h3>No news found.</h3>";
      return;
    }

    displayNews(data.articles);
  } catch (err) {
    newsContainer.innerHTML = `<h3 style="color:red;">Error: ${err.message}</h3>`;
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = articles
    .map((a) => {
      return `
      <div class="news-card">
        <img src="${a.urlToImage || 'https://via.placeholder.com/300'}" />
        <div class="news-content">
          <h3>${a.title}</h3>
          <p>${a.description || ""}</p>
          <small>${a.source.name} - ${new Date(a.publishedAt).toLocaleDateString()}</small>
          <a href="${a.url}" target="_blank">Read More →</a>
        </div>
      </div>`;
    })
    .join("");
}


searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  query = searchInput.value;
  page = 1;
  fetchNews();
});

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  query = "";
  page = 1;
  fetchNews();
});

countrySelect.addEventListener("change", () => {
  country = countrySelect.value;
  page = 1;
  fetchNews();
});

sortSelect.addEventListener("change", () => {
  sortBy = sortSelect.value;
  page = 1;
  fetchNews();
});

categoriesDiv.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    document.querySelectorAll(".categories button").forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    category = e.target.dataset.category;
    page = 1;
    fetchNews();
  }
});

nextBtn.addEventListener("click", () => {
  page++;
  fetchNews();
});

prevBtn.addEventListener("click", () => {
  if (page > 1) {
    page--;
    fetchNews();
  }
});


fetchNews();
