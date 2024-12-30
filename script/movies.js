let moviesData = []; // Holds the movie data
let currentEditIndex = null; // Tracks the movie being edited

// Initialize the movies page
document.addEventListener('DOMContentLoaded', () => {
  initializeMoviesPage();
});

// Load the movies and display the selected binder's movies
function initializeMoviesPage() {
  const binderNumber = getBinderFromQuery();
  if (!binderNumber) {
    alert('Invalid binder number');
    window.location.href = 'index.html'; // Redirect back if invalid
    return;
  }

  const storedMovies = localStorage.getItem('movies');
  if (storedMovies) {
    moviesData = JSON.parse(storedMovies);
    displayMovies(binderNumber);
  } else {
    fetch('movies.json')
      .then(response => response.json())
      .then(data => {
        moviesData = data;
        localStorage.setItem('movies', JSON.stringify(moviesData)); // Save to localStorage
        displayMovies(binderNumber);
      })
      .catch(error => console.error('Error loading movies:', error));
  }
}

// Extract the binder number from the query parameter
function getBinderFromQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('binder');
}

// Display movies for the selected binder
function displayMovies(binderNumber) {
  const movieList = document.getElementById('movieList');
  const binderTitle = document.getElementById('binderTitle');
  binderTitle.textContent = `Movies in Binder ${binderNumber}`;

  // Filter movies for the selected binder
  const moviesInBinder = moviesData.filter((movie) => movie.binder == binderNumber);

  if (moviesInBinder.length > 0) {
    movieList.innerHTML = ''; // Clear previous content
    moviesInBinder.forEach((movie, index) => {
      const movieDiv = document.createElement('div');
      movieDiv.className = 'movie-item';

      // Check if the movie contains sub-movies
      const isCollection = movie.movies && movie.movies.length > 0;

      // Structure: Title (clickable for collections), Genre, Binder #, Page #, Edit, and Delete
      movieDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3>
            ${
              isCollection
                ? `<a href="collection.html?title=${encodeURIComponent(
                    movie.title
                  )}" style="text-decoration: none; color: blue;">${movie.title}</a>`
                : movie.title
            }
          </h3>
          <p>Genre: ${movie.kind}</p>
          <p>Binder: ${movie.binder} | Page: ${movie.page}</p>
        </div>
        <div>
          <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
          <button class="delete-btn" onclick="deleteMovie(${index})">Delete</button>
        </div>
      </div>
    `;
      movieList.appendChild(movieDiv);
    });
  } else {
    movieList.innerHTML = '<p>No movies found in this binder.</p>';
  }
}


// Open the edit modal for the selected movie
// Open the edit modal for the selected movie
function openEditModal(index) {
  // Ensure index matches the current binder's movies
  const binderNumber = getBinderFromQuery();
  const moviesInBinder = moviesData.filter((movie) => movie.binder == binderNumber);

  if (index < 0 || index >= moviesInBinder.length) {
    alert('Invalid movie index.');
    return;
  }

  currentEditIndex = index;
  const movie = moviesInBinder[index]; // Select the correct movie from the binder

  // Pre-fill inputs with the current movie data
  document.getElementById('editTitleInput').value = movie.title;
  document.getElementById('editKindInput').value = movie.kind;
  document.getElementById('editBinderInput').value = movie.binder;
  document.getElementById('editPageInput').value = movie.page;
  document.getElementById('editMoviesInput').value = movie.movies ? movie.movies.join(', ') : '';

  // Show the modal
  const modal = document.getElementById('editMovieModal');
  modal.style.display = 'block';

  // Scroll the modal into view
  modal.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Focus on the first input field
  document.getElementById('editTitleInput').focus();
}

// Save the edited movie
function saveEdit() {
  if (currentEditIndex === null) return;

  // Get updated values
  const title = document.getElementById('editTitleInput').value.trim();
  const kind = document.getElementById('editKindInput').value.trim();
  const binder = parseInt(document.getElementById('editBinderInput').value, 10);
  const page = parseInt(document.getElementById('editPageInput').value, 10);
  const movies = document
    .getElementById('editMoviesInput')
    .value.split(',')
    .map((m) => m.trim())
    .filter((m) => m);

  if (!title || !kind || isNaN(binder) || isNaN(page)) {
    alert('Please fill out all required fields.');
    return;
  }

  // Get the current binder number and its movies
  const binderNumber = getBinderFromQuery();
  const moviesInBinder = moviesData.filter((movie) => movie.binder == binderNumber);

  // Update the movie in the array
  const globalIndex = moviesData.findIndex(
    (movie) =>
      movie.binder == binderNumber && moviesInBinder.indexOf(movie) === currentEditIndex
  );

  if (globalIndex !== -1) {
    moviesData[globalIndex] = { title, kind, binder, page, movies };
    localStorage.setItem('movies', JSON.stringify(moviesData)); // Save changes
    displayMovies(binderNumber); // Refresh display
    closeEditModal(); // Close modal
  } else {
    alert('Failed to update the movie.');
  }
}

// Close the edit modal
function closeEditModal() {
  const modal = document.getElementById('editMovieModal');
  modal.style.display = 'none';
  currentEditIndex = null;
}


// Delete a movie
function deleteMovie(index) {
  const binderNumber = getBinderFromQuery();

  // Re-filter movies for the current binder
  const moviesInBinder = moviesData.filter((movie) => movie.binder == binderNumber);

  // Find the global index of the movie to delete
  const movieToDelete = moviesInBinder[index];
  const globalIndex = moviesData.findIndex(
    (movie) =>
      movie.title === movieToDelete.title &&
      movie.binder === movieToDelete.binder &&
      movie.page === movieToDelete.page
  );

  if (globalIndex !== -1) {
    // Remove the movie from the global array
    moviesData.splice(globalIndex, 1);
    localStorage.setItem('movies', JSON.stringify(moviesData)); // Save changes

    // Refresh the display
    displayMovies(binderNumber);
  } else {
    alert('Failed to delete the movie.');
  }
}


// Go back to the main page
function goBack() {
  window.location.href = 'index.html';
}
