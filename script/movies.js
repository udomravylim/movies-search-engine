document.addEventListener("DOMContentLoaded", () => {
    const movieList = document.getElementById('movieList');
    const binderTitle = document.getElementById('binderTitle');
  
    // Get the binder number from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const binderNumber = urlParams.get('binder');
  
    // Update header with binder number
    binderTitle.textContent = `Movies in Binder ${binderNumber}`;
  
    // Fetch movie data from movies.json
    fetch('movies.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        // Filter movies based on the binder number
        const moviesInBinder = data.filter(movie => movie.binder == binderNumber);
  
        // Display movies or show a message if none exist
        if (moviesInBinder.length > 0) {
          displayMovies(moviesInBinder);
        } else {
          movieList.innerHTML = '<p>No movies found in this binder.</p>';
        }
      })
      .catch(error => {
        console.error('Error loading movie data:', error);
        movieList.innerHTML = '<p>Failed to load movie data. Please try again later.</p>';
      });
  
    // Function to dynamically display movies in the binder
    function displayMovies(movies) {
      movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie-item';
        movieDiv.innerHTML = `
          <h3>${movie.title}</h3>
          <p>Type: ${movie.kind}</p>
          <p>Page: ${movie.page}</p>
        `;
        movieList.appendChild(movieDiv);
      });
    }
  });
  