import { appState } from './state.js'
import { saveToLocalStorage, loadFromLocalStorage } from './utils.js'
import { loadMovies, initializeSearchQuery } from './api.js'
import { renderMovies } from './ui.js'
import { setupEventListeners } from './handlers.js'

function main() {
  let defaultSearch = 'new'

  // Load previous movies from localStorage, if any
  const savedMovies = loadFromLocalStorage('movies') || []
  console.log('savedMovies', savedMovies)

  if (savedMovies.length > 0) {
    // dispatch({ type: 'SET_MOVIES', payload: savedMovies })
    appState.movies = savedMovies
    renderMovies()
  } else {
    initializeSearchQuery()
      .then(() => {
        return loadMovies(appState.searchQuery)
      })
      .then((data) => {
        saveToLocalStorage('movies', data)
        appState.movies = data
        console.log('data', data)
        renderMovies()
      })
      .catch((error) => {
        console.error('Error getting user region:', error)
        return loadMovies(defaultSearch) // Fallback in case of error
      })
  }

  // Set up event listeners
  setupEventListeners()
  // setupEventListeners(dispatch)
}

document.addEventListener('DOMContentLoaded', main)
