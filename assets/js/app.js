// ===== D-Cine App.js =====

// Global state
let genreData = null;
let documentaries = [];

// DOM refs
const genreSearchInput = document.getElementById("genreSearchInput");
const genreSearchResults = document.getElementById("genreSearchResults");
const documentaryCardsContainer = document.getElementById("documentaryCards");

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  loadGenreData();
  loadDocumentaries();
  setupGenreSearch();
});

// ---- Data loading ----
function loadGenreData() {
  fetch("assets/data/genre.json")
    .then(res => res.json())
    .then(data => {
      genreData = data;
    })
    .catch(err => console.error("Error loading genre.json:", err));
}

function loadDocumentaries() {
  fetch("assets/data/documentaries.json")
    .then(res => res.json())
    .then(data => {
      documentaries = data;
      renderDocumentaryCards(documentaries);
    })
    .catch(err => console.error("Error loading documentaries.json:", err));
}

// ---- Genre / taxonomy search ----
function setupGenreSearch() {
  if (!genreSearchInput) return;

  genreSearchInput.addEventListener("input", () => {
    const term = genreSearchInput.value.trim().toLowerCase();
    if (!term) {
      genreSearchResults.innerHTML = "";
      return;
    }

    if (!genreData) return;

    const results = searchGenres(term);
    displayGenreResults(results);
  });
}

function searchGenres(term) {
  const results = [];

  // Main genres
  for (const category in genreData.genres) {
    genreData.genres[category].forEach(genre => {
      if (genre.toLowerCase().includes(term)) {
        results.push({
          type: "Genre",
          category,
          name: genre
        });
      }
    });
  }

  // Micro-genres
  genreData.micro_genres.forEach(micro => {
    if (micro.toLowerCase().includes(term)) {
      results.push({
        type: "Micro-Genre",
        category: "Micro",
        name: micro
      });
    }
  });

  // Documentary modes
  genreData.documentary_modes.forEach(mode => {
    if (mode.name.toLowerCase().includes(term)) {
      results.push({
        type: "Documentary Mode",
        category: "Mode",
        name: mode.name
      });
    }
  });

  return results;
}

function displayGenreResults(results) {
  genreSearchResults.innerHTML = "";

  if (!results.length) {
    genreSearchResults.innerHTML =
      `<li class="list-group-item">No results found</li>`;
    return;
  }

  results.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${item.name} (${item.type})`;
    genreSearchResults.appendChild(li);
  });
}

// ---- Documentary cards ----
function renderDocumentaryCards(list) {
  if (!documentaryCardsContainer) return;

  documentaryCardsContainer.innerHTML = "";

  if (!list.length) {
    documentaryCardsContainer.innerHTML = "<p>No documentaries found.</p>";
    return;
  }

  list.forEach(doc => {
    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4";


    // ⭐ Fallback logic goes HERE
    const imageSrc = doc.image_url || doc.fallback_image;

    card.innerHTML = `
      <div class="card doc-card h-100">
        <img 
          src="${imageSrc}" 
          onerror="this.src='assets/images/fallback.jpg'" 
          class="card-img-top doc-img" 
          alt="${doc.title}"
        >
        <div class="card-body">
          <h5 class="card-title">${doc.title}</h5>
          <p class="card-text">
            <strong>Genre:</strong> ${doc.genre}<br>
            <strong>Year:</strong> ${doc.year}<br>
            <strong>Platform:</strong> ${doc.platform}
          </p>
        </div>
      </div>
    `;

    documentaryCardsContainer.appendChild(card);
  });
}



// ---- Optional: title/genre/tag search for documentaries ----
// Example hook if you later add a documentary search input:
// const docSearchInput = document.getElementById("docSearchInput");
// docSearchInput.addEventListener("input", () => {
//   const q = docSearchInput.value.trim().toLowerCase();
//   const filtered = documentaries.filter(doc =>
//     doc.title.toLowerCase().includes(q) ||
//     doc.genre.toLowerCase().includes(q) ||
//     doc.micro_genres.some(m => m.toLowerCase().includes(q)) ||
//     doc.tags.some(t => t.toLowerCase().includes(q))
//   );
//   renderDocumentaryCards(filtered);
// });
