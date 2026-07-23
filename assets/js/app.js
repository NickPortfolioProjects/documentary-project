// Load JSON file
fetch('assets/data/genre.json')
    .then(response => response.json())
    .then(data => {
        window.genreData = data;
        console.log("Genre JSON loaded.");
    })
    .catch(err => console.error("JSON load error:", err));


// Search function
function searchGenres(term) {
    term = term.toLowerCase();
    const results = [];

    // Search main genres
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

    // Search micro-genres
    genreData.micro_genres.forEach(micro => {
        if (micro.toLowerCase().includes(term)) {
            results.push({
                type: "Micro-Genre",
                category: "Micro",
                name: micro
            });
        }
    });

    // Search documentary modes
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


// Display results
function displayResults(results) {
    const list = document.getElementById("genreSearchResults");
    list.innerHTML = "";

    if (results.length === 0) {
        list.innerHTML = `<li class="list-group-item">No results found</li>`;
        return;
    }

    results.forEach(item => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${item.name} (${item.type})`;
        list.appendChild(li);
    });
}


// Hook search bar to search function
document.getElementById("genreSearchInput").addEventListener("input", function () {
    const term = this.value.trim();
    if (term.length === 0) {
        document.getElementById("genreSearchResults").innerHTML = "";
        return;
    }

    const results = searchGenres(term);
    displayResults(results);
});
