const OMDB_API_KEY = 'ccb97894'
const BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`

import { refactorMovies } from './dataHandlers.js'
import { appState } from './state.js'

/**
 * Fetch movies based on search term
 * @param {string} searchQuery - Movie title
 * @returns {Promise<Array>} Resolves to a list of movies with complete data
 */
export function fetchMovies(searchQuery) {
  let movies_no_data = []
  let totalPages = 1
  appState.searchQuery = searchQuery

  return fetch(`${BASE_URL}&s=${searchQuery}&page=1`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.Search) return []

      movies_no_data = movies_no_data.concat(data.Search)
      totalPages = Math.ceil(data.totalResults / 10)
      // Limit number of pages, 10 movies per page
      totalPages = Math.min(totalPages, 2)

      const fetchPromises = []
      for (let i = 2; i <= totalPages; i++) {
        fetchPromises.push(
          fetch(`${BASE_URL}&s=${searchQuery}&page=${i}`)
            .then((res) => res.json())
            .then((pageData) => {
              if (pageData.Search) {
                movies_no_data = movies_no_data.concat(pageData.Search)
              }
            })
        )
      }

      return Promise.all(fetchPromises).then(() => movies_no_data)
    })
    .then((movieList) => {
      return fetchMovieDetails(movieList)
    })
    .then((movies) => {
      let finalizedMovies = refactorMovies(movies)
      return new Promise((resolve, reject) => {
        resolve(finalizedMovies)
      })
    })
    .catch((error) => {
      console.error('Error fetching movies:', error)
      return []
    })
}

/**
 * Fetch full movie details for list of movies.
 * @param {Array} movieList - Array of movies with only minimal details
 * @returns {Promise<Array>} Resolves to array of movies with full details
 */
function fetchMovieDetails(movieList) {
  if (!movieList || movieList.length === 0) {
    return Promise.resolve([]) // Prevents errors if no movies found
  }

  let movies_data = []
  const detailPromises = movieList.map((movie) =>
    fetch(`${BASE_URL}&i=${movie.imdbID}`)
      .then((res) => res.json())
      .then((data) => movies_data.push(data))
  )

  return Promise.all(detailPromises)
    .then(() => {
      return new Promise((resolve, reject) => {
        resolve(movies_data)
      })
    })
    .catch((error) => {
      console.error('Error fetching movie details:', error)
      return []
    })
}

export const initializeSearchQuery = (fallback = 'Mars') => {
  return fetch('https://geolocation-db.com/json/')
    .then((response) => response.json())
    .then((geoData) => {
      let searchQuery
      if (geoData.state) {
        searchQuery = geoData.state
        app
      } else {
        searchQuery = appState.defaultSearch
      }
      appState.searchQuery = searchQuery
      localStorage.setItem('searchQuery', searchQuery)
      return searchQuery
    })
    .catch((error) => {
      console.error('Error fetching location:', error)
      appState.searchQuery = appState.defaultSearch
    })
}
