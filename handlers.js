import { appState } from './state.js'
import { fetchMovies } from './api.js'
import { saveMovies, saveSearchQuery } from './dataHandlers.js'
import { renderUI, startLoading } from './ui.js'

export function setupEventListeners(dispatch) {
  // "searchForm" is needed by by other event listeners
  const searchForm = document.getElementById('search_form')

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let query = event.target[0].value
    appState.searchQuery = query
    startLoading()
    fetchMovies(query).then((movies) => {
      saveMovies(movies)
      saveSearchQuery(query)
      renderUI()
      stopLoading()
    })
  })

  document
    .getElementById('search_title')
    .addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        searchForm.dispatchEvent(new Event('submit'))
      }
    })

  document.getElementById('search_icon').addEventListener('click', () => {
    searchForm.dispatchEvent(new Event('submit'))
  })

  document
    .getElementById('filter_genre')
    .addEventListener('change', (event) => {
      appState.filters.genre = event.target.value
      renderUI()
    })

  document
    .getElementById('filter_awards')
    .addEventListener('change', (event) => {
      appState.filters.awards = event.target.checked
      renderUI()
    })

  document.getElementById('sort_movies').addEventListener('change', (event) => {
    appState.sort = event.target.value
    appState.movies = sortMovies(appState.movies, appState.sort)
    renderUI()
  })
}

function sortMovies(movies, sortType) {
  if (sortType === 'Default') return [...appState.originalMovies] // Reset to default order

  return [...movies].sort((a, b) => {
    switch (sortType) {
      case 'Year':
        return b.yearInt - a.yearInt // Newest first
      case 'YearOld':
        return a.yearInt - b.yearInt // Oldest first
      case 'Rating':
        return b.ratingInt - a.ratingInt // Highest rating first
      case 'BoxOffice':
        return b.boxOfficeInt - a.boxOfficeInt // Highest box office first
      case 'Title':
        return a.Title.localeCompare(b.Title)
      default:
        return 0
    }
  })
}
