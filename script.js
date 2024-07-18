const apiKey = "483948ba";

//function to get the movies
async function getMovies(query) {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const movieData = await response.json();
    return movieData.Search || [];
  } catch (error) {
    console.error(error.message);
  }
}

//funtion to render the search results
function displayMovies(movieList) {
  const searchResultsContainer = document.getElementById("searchResults");
  searchResultsContainer.innerHTML = "";

  movieList.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
    <div class="left">
          <img src="${movie.Poster}" alt="${movie.Title}" />
    </div>
    <div class="right">
        <div class="title">${movie.Title}</div>
        <div class="plot">${movie.Type}</div>
        <div class="footer">
            <div class="rating">${movie.Year}</div>
            <button class="favourite-btn" data-imdbid="${movie.imdbID}">Add to Favourites</button>
            <button class="favourite-btn">
              <a href="moviePage.html?id=${movie.imdbID}">Movie Details</a>
            </button>
        </div>
    </div> 
    `;
    searchResultsContainer.appendChild(movieCard);

    const favouriteButtons = document.querySelectorAll(".favourite-btn");
    favouriteButtons.forEach((button) => {
      button.addEventListener("click", addTofavoriteList);
    });
  });
}

//Adding eventListeners for search button
const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
searchButton.addEventListener("click", function () {
  // const searchInput = document.getElementById("search-input");

  const input = searchInput.value.trim();

  if (input.length > 0) {
    getMovies(input)
      .then((results) => {
        displayMovies(results);
        localStorage.setItem("searchResult", JSON.stringify(results));
      })
      .catch((error) => console.error("Error on searching of movies", error));
  }
});

//function to add the movie to the favorite list
async function addTofavoriteList(event) {
  //get the id of the movie
  const imdbID = event.target.dataset.imdbid;
  //get the details of the movie
  const movie = await getMovieDetails(imdbID);

  if (movie) {
    const favMovieList = JSON.parse(localStorage.getItem("favourites")) || [];

    if (!favMovieList.some((m) => m.imdbID === movie.imdbID)) {
      favMovieList.push(movie);
      localStorage.setItem("favourites", JSON.stringify(favMovieList));
      alert(`${movie.Title} has been added to your favourites!`);
    } else {
      alert(`${movie.Title} is already in your favourites!`);
    }
  }
}

async function getMovieDetails(id) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
  );
  const details = await response.json();
  return details.Response === "True" ? details : null;
}

// Automatically display search results if available from previous search
const previousSearchResults = JSON.parse(localStorage.getItem("searchResults"));
if (previousSearchResults && previousSearchResults.length > 0) {
  displaySearchResults(previousSearchResults);
}

//Adding active class to the nav elements
var header = document.getElementById("navbar");
var btns = header.getElementsByClassName("link");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

//adding keyboard control to add todo
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && searchInput.value.trim() !== "") {
    // getMovies(searchInput.value.trim());
    getMovies(searchInput.value.trim())
      .then((results) => {
        displayMovies(results);
        localStorage.setItem("searchResult", JSON.stringify(results));
      })
      .catch((error) => console.error("Error on searching of movies", error));
  }
});
