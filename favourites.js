//function to display the movies
function displayFavMovies() {
  const favouritesListContainer = document.getElementById("favouritesList");
  favouritesListContainer.innerHTML = "";

  const favMovieList = JSON.parse(localStorage.getItem("favourites")) || [];
  console.log(favMovieList);
  if (favMovieList.length === 0) {
    const showMsg = document.createElement("h1");
    showMsg.textContent = "Your favourite List is empty";
    favouritesListContainer.appendChild(showMsg);
  } else {
    favMovieList.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      movieCard.innerHTML = `
    <div class="left">
          <img src="${movie.Poster}" alt="${movie.Title}" />
    </div>
    <div class="right">
        <div class="title">${movie.Title}</div>
        <div class="plot">${movie.Plot}</div>
        <div class="footer">
            <div class="rating">${movie.imdbRating}</div>

            <button class="unfavourite-btn" data-imdbid="${movie.imdbID}">Unfavourite</button>
            <button class="favourite-btn">
              <a href="moviePage.html?id=${movie.imdbID}">Movie Details</a>
            </button>
        </div>
    </div> 
    `;
      favouritesListContainer.appendChild(movieCard);
    });
  }
  const removeButtons = document.querySelectorAll(".unfavourite-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", removeFromfavoriteList);
  });
}
displayFavMovies();

//remove movie for favourite list
function removeFromfavoriteList(event) {
  const imdbID = event.target.dataset.imdbid;
  const favouritesList = JSON.parse(localStorage.getItem("favourites")) || [];

  const movieToRemove = favouritesList.find((movie) => movie.imdbID === imdbID);
  if (movieToRemove) {
    const updatedFavouritesList = favouritesList.filter(
      (movie) => movie.imdbID !== imdbID
    );
    localStorage.setItem("favourites", JSON.stringify(updatedFavouritesList));
    alert(`${movieToRemove.Title} has been removed from your favorites!`);
    displayFavMovies(); // Refresh the favorites list
  } else {
    alert("Movie not found in favorites!");
  }
}
// Automatically display favorites when the favourites.html page is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayFavMovies();
});
