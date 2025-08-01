import { appState } from './state.js'
import {
  loadFromLocalStorage,
  saveMovies,
  saveSearchQuery,
} from './dataHandlers.js'
import { fetchMovies, initializeSearchQuery } from './api.js'
import { renderUI, startLoading } from './ui.js'
import { setupEventListeners } from './handlers.js'

async function main() {
  try {
    startLoading()

    const savedMovies = loadFromLocalStorage('movies') || []
    const savedQuery = loadFromLocalStorage('searchQuery') || ''

    if (savedQuery.length > 0) {
      saveSearchQuery(savedQuery)
    } else {
      saveSearchQuery(appState.defaultSearch)
    }

    if (savedMovies.length > 0) {
      appState.movies = savedMovies
      renderUI()
    } else {

      initializeSearchQuery()
        .then((searchQuery) => {
          saveSearchQuery(searchQuery)
          startLoading()
          fetchMovies(appState.searchQuery).then((movies) => {
            saveMovies(movies)
            renderUI()
          })
        })
        .catch((err) => {
          console.error(err)
        })
    }

    setupEventListeners()

    const progressBar = document.querySelector('.progress-bar')
    progressBar.style.animation = 'none'
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}

document.addEventListener('DOMContentLoaded', main)
