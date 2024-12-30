// Initialize the collection page
document.addEventListener('DOMContentLoaded', () => {
    initializeCollectionPage();
  });
  
  // Load the collection and display its movies
  function initializeCollectionPage() {
    const collectionTitle = getTitleFromQuery();
    if (!collectionTitle) {
      alert('Invalid collection title');
      window.location.href = 'movies.html'; // Redirect back if invalid
      return;
    }
  
    const storedMovies = localStorage.getItem('movies');
    if (storedMovies) {
      const moviesData = JSON.parse(storedMovies);
  
      // Find the collection by title
      const collection = moviesData.find(
        (movie) => movie.title === decodeURIComponent(collectionTitle)
      );
  
      if (collection && collection.movies && collection.movies.length > 0) {
        displaySubMovies(collection);
      } else {
        alert('No sub-movies found for this collection.');
        window.location.href = 'movies.html';
      }
    } else {
      alert('No movie data found.');
      window.location.href = 'movies.html';
    }
  }
  
  // Extract the collection title from the query parameter
  function getTitleFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('title');
  }
  
  // Display the sub-movies of the selected collection
  function displaySubMovies(collection) {
    const collectionTitle = document.getElementById('collectionTitle');
    const subMovieList = document.getElementById('subMovieList');
  
    collectionTitle.textContent = `Collection: ${collection.title}`;
  
    collection.movies.forEach((subMovie, index) => {
      const subMovieDiv = document.createElement('div');
      subMovieDiv.className = 'sub-movie-item';
  
      subMovieDiv.innerHTML = `
        <p>${index + 1}. ${subMovie}</p>
      `;
  
      subMovieList.appendChild(subMovieDiv);
    });
  }
  
  // Go back to the previous page
  function goBack() {
    window.history.back();
  }
  