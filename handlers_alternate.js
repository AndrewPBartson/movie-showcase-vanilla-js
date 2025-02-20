import { appState } from './state.js'
import { fetchAllMovies, fetchMovieDetails } from './api.js'
import { renderMovies } from './ui.js'

export function setupEventListeners() {
  document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const searchQuery = document.getElementById('search-input').value
    appState.searchQuery = searchQuery

    fetchAllMovies(searchQuery)
      .then((movieList) => fetchMovieDetails(movieList))
      .then(() => renderMovies())
  })

  document
    .getElementById('filter-genre')
    .addEventListener('change', (event) => {
      appState.filters.genre = event.target.value
      renderMovies()
    })

  document
    .getElementById('filter-awards')
    .addEventListener('change', (event) => {
      appState.filters.awards = event.target.checked
      renderMovies()
    })
}
