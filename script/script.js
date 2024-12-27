document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');
    const suggestionList = document.getElementById('searchResults');
    const binderList = document.getElementById('binderList');
  
    // Display all binders by default
    displayBinders();
  
    // Fetch data for search suggestions
    searchInput.addEventListener('input', (event) => {
      const searchTerm = event.target.value.toLowerCase();
      if (searchTerm) {
        fetch('movies.json')
          .then(response => response.json())
          .then(data => {
            const filteredMovies = data.filter(movie =>
              movie.title.toLowerCase().includes(searchTerm) || // Search by title
              movie.kind.toLowerCase().includes(searchTerm)    // Search by type
            );
            displaySuggestions(filteredMovies);
          })
          .catch(error => console.error('Error fetching movies:', error));
      } else {
        suggestionList.innerHTML = ''; // Clear suggestions if input is empty
      }
    });
  
    // Function to display suggestions
    function displaySuggestions(movies) {
      suggestionList.innerHTML = ''; // Clear previous suggestions
  
      if (movies.length > 0) {
        movies.forEach(movie => {
          const suggestionItem = document.createElement('div');
          suggestionItem.className = 'suggestion-item';
          suggestionItem.innerHTML = `
            <strong>${movie.title}</strong> (${movie.kind})<br>
            Binder: ${movie.binder}, Page: ${movie.page}
          `;
  
          // Click event to navigate to the movie's binder
          suggestionItem.addEventListener('click', () => {
            window.location.href = `movies.html?binder=${movie.binder}`;
          });
  
          suggestionList.appendChild(suggestionItem);
        });
      } else {
        suggestionList.innerHTML = '<div class="suggestion-item">No results found</div>';
      }
    }
  
    // Close suggestions when clicking outside
    document.addEventListener('click', (event) => {
      if (!searchInput.contains(event.target) && !suggestionList.contains(event.target)) {
        suggestionList.innerHTML = '';
      }
    });
  
    // Display all binders
    function displayBinders() {
      for (let i = 1; i <= 17; i++) {
        const binderDiv = document.createElement('div');
        binderDiv.className = 'binder';
        binderDiv.textContent = `Binder ${i}`;
        binderDiv.setAttribute('data-binder', i);
  
        // Navigate to movies.html when binder is clicked
        binderDiv.addEventListener('click', () => {
          const binderNumber = binderDiv.getAttribute('data-binder');
          window.location.href = `movies.html?binder=${binderNumber}`;
        });
  
        binderList.appendChild(binderDiv);
      }
    }
  });
  