document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const suggestionList = document.getElementById("searchResults");
  
    let moviesData = [];
  
    // Fetch movie data
    fetch("movies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies.json");
        }
        return response.json();
      })
      .then((data) => {
        moviesData = data;
        console.log("Movies loaded:", moviesData);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  
    // Perform search and redirect to search.html
    function performSearch() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        window.location.href = `search.html?query=${encodeURIComponent(searchTerm)}`;
      } else {
        alert("Please enter a search term.");
      }
    }
  
    // Handle search button click
    searchButton.addEventListener("click", performSearch);
  
    // Show suggestions while typing
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase().trim();
      if (searchTerm) {
        const filteredMovies = moviesData.filter(
          (movie) =>
            (movie.title && movie.title.toLowerCase().includes(searchTerm)) ||
            (movie.kind && movie.kind.toLowerCase().includes(searchTerm))
        );
        displaySuggestions(filteredMovies);
      } else {
        suggestionList.innerHTML = ""; // Clear suggestions if input is empty
      }
    });
  
    // Display suggestions
    function displaySuggestions(movies) {
      suggestionList.innerHTML = "";
  
      if (movies.length > 0) {
        movies.forEach((movie) => {
          const suggestionItem = document.createElement("div");
          suggestionItem.className = "suggestion-item";
          suggestionItem.innerHTML = `
            <strong>${movie.title}</strong> (${movie.kind})<br>
            Binder: ${movie.binder}, Page: ${movie.page}
          `;
          suggestionItem.addEventListener("click", () => {
            window.location.href = `movies.html?binder=${movie.binder}`;
          });
          suggestionList.appendChild(suggestionItem);
        });
      } else {
        suggestionList.innerHTML = '<div class="suggestion-item">No results found</div>';
      }
    }
  });
  