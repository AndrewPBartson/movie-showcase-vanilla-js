// for now, import appState
import { appState } from './state.js'

// export function renderMovies(appState) {
export function renderMovies() {
  console.log('appState.movies', appState.movies)
  const movieContainer = document.getElementById('movie_list')
  movieContainer.innerHTML = ''

  const filteredMovies = appState.movies.filter((movie) => {
    if (appState.filters.genre && !movie.Genre.includes(appState.filters.genre))
      return false
    if (appState.filters.awards && movie.Awards === 'N/A') return false
    return true
  })

  filteredMovies.forEach((movie) => {
    const movieEl = document.createElement('div')
    movieEl.className = 'movie-card'
    movieEl.innerHTML = `<h3>${movie.Title} (${movie.Year})</h3><p>${
      movie.Genre
    }</p><p>Awards: ${movie.Awards || 'None'}</p>`
    movieContainer.appendChild(movieEl)
  })
}
