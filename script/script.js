let moviesData = []; // Holds the movie data
const TOTAL_BINDERS = 17; // Total number of binders to display

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
});

// Load data from JSON or localStorage
function initializeApp() {
  const storedMovies = localStorage.getItem('movies');
  if (storedMovies) {
    moviesData = JSON.parse(storedMovies);
    displayBinders();
  } else {
    fetch('movies.json')
      .then(response => response.json())
      .then(data => {
        moviesData = data;
        localStorage.setItem('movies', JSON.stringify(moviesData)); // Save to localStorage
        displayBinders();
      })
      .catch(error => console.error('Error loading movies:', error));
  }
}

// Set up event listeners
function setupEventListeners() {
  // Add movie button listener
  const addMovieButton = document.getElementById('addMovieButton');
  if (addMovieButton) {
    addMovieButton.addEventListener('click', addNewMovie);
  }

  // Search button listener
  const searchButton = document.getElementById('searchButton');
  if (searchButton) {
    searchButton.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default behavior
      performSearch();
    });
  }
}

// Display all 17 binders
function displayBinders() {
  const binderList = document.getElementById('binderList');
  binderList.innerHTML = ''; // Clear previous content

  for (let i = 1; i <= TOTAL_BINDERS; i++) {
    const binderDiv = document.createElement('div');
    binderDiv.className = 'binder';

    binderDiv.innerHTML = `
      <h3 onclick="openBinder(${i})" style="cursor: pointer;">Binder ${i}</h3>
    `;

    binderList.appendChild(binderDiv);
  }
}

// Redirect to the movies page with the binder number
function openBinder(binderNumber) {
  window.location.href = `movies.html?binder=${binderNumber}`;
}


// Add a new movie
function addNewMovie() {
  const title = document.getElementById('titleInput').value.trim();
  const kind = document.getElementById('kindInput').value.trim();
  const binder = parseInt(document.getElementById('binderInput').value, 10);
  const page = parseInt(document.getElementById('pageInput').value, 10);
  const movies = document
    .getElementById('moviesInput')
    .value.split(',')
    .map((m) => m.trim())
    .filter((m) => m); // Split by comma, trim spaces, and filter empty entries

  if (!title || !kind || isNaN(binder) || isNaN(page) || binder < 1 || binder > TOTAL_BINDERS) {
    alert('Please fill out all required fields and ensure the binder number is between 1 and 17.');
    return;
  }

  const newMovie = { title, kind, binder, page, movies };
  moviesData.push(newMovie); // Add to the in-memory data
  localStorage.setItem('movies', JSON.stringify(moviesData)); // Save to localStorage
  displayBinders(); // Refresh display
  clearForm(); // Clear input fields
}

// Clear the input form for adding new movies
function clearForm() {
  document.getElementById('titleInput').value = '';
  document.getElementById('kindInput').value = '';
  document.getElementById('binderInput').value = '';
  document.getElementById('pageInput').value = '';
  document.getElementById('moviesInput').value = '';
}
