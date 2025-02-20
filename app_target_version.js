import { appState } from './state.js'
import { fetchAllMovies, fetchMovieDetails } from './api.js'
import { renderMovies } from './ui.js'
import { setupEventListeners } from './handlers.js'
import { loadFromLocalStorage } from './utils.js'

function main() {
  const savedMovies = loadFromLocalStorage('movies')
  if (savedMovies.length > 0) {
    appState.movies = savedMovies
    renderMovies()
  } else {
    fetchAllMovies(new Date().getFullYear() - 1)
      .then((movieList) => fetchMovieDetails(movieList))
      .then(() => renderMovies())
  }

  setupEventListeners()
}

document.addEventListener('DOMContentLoaded', main)
