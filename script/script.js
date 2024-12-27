document.addEventListener("DOMContentLoaded", () => {
    const binderList = document.getElementById('binderList');
  
    // Display all binders by default
    displayBinders();
  
    // Fetch movie data and associate it with binders
    fetch('movies.json')
      .then(response => response.json())
      .then(data => {
        attachBinderClickEvents(data);
      })
      .catch(error => console.error('Error loading movie data:', error));
  
    // Function to display all binders
    function displayBinders() {
      for (let i = 1; i <= 17; i++) {
        const binderDiv = document.createElement('div');
        binderDiv.className = 'binder';
        binderDiv.textContent = `Binder ${i}`;
        binderDiv.setAttribute('data-binder', i); // Add a data attribute for the binder number
        binderList.appendChild(binderDiv);
      }
    }
  
    // Function to attach click events to binders
    function attachBinderClickEvents(movies) {
      const binders = document.querySelectorAll('.binder');
      binders.forEach(binder => {
        binder.addEventListener('click', () => {
          const binderNumber = binder.getAttribute('data-binder');
          const moviesInBinder = movies.filter(movie => movie.binder == binderNumber);
          displayMovies(moviesInBinder, binderNumber);
        });
      });
    }
  
    // Function to display movies in a specific binder
    function displayMovies(movies, binder) {
      if (movies.length > 0) {
        alert(`Movies in Binder ${binder}:\n` + movies.map(movie => movie.title).join('\n'));
      } else {
        alert(`No movies found in Binder ${binder}.`);
      }
    }
  });
  
  // Search functionality remains the same
  function searchMovies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    fetch('movies.json')
      .then(response => response.json())
      .then(movies => {
        const filteredMovies = movies.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.genre.toLowerCase().includes(searchTerm) ||
          movie.year.toString().includes(searchTerm)
        );
  
        if (filteredMovies.length > 0) {
          alert(`Search Results:\n` + filteredMovies.map(movie => movie.title).join('\n'));
        } else {
          alert("No movies found.");
        }
      });
  }
  