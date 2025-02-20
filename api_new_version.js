const API_KEY = 'ccb97894'
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`

import { appState } from './state.js'
import { saveToLocalStorage } from './utils.js'

/**
 * Fetches movies based on a search term, handling pagination.
 * @param {string} searchQuery - Movie title or year
 * @returns {Promise<Array>} Resolves to a list of movies with minimal data
 */
export function fetchAllMovies(searchQuery) {
  let movies_no_data = []
  let totalPages = 1

  return fetch(`${BASE_URL}&s=${searchQuery}&page=1`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.Search) return []

      movies_no_data = movies_no_data.concat(data.Search)
      totalPages = Math.ceil(data.totalResults / 10)
      totalPages = Math.min(totalPages, 10) // Limit to first 10 pages

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
    .catch((error) => {
      console.error('Error fetching movies:', error)
      return []
    })
}

/**
 * Fetches full movie details for a given list of movies.
 * @param {Array} movieList - Array of movies with only basic data
 * @returns {Promise<Array>} Resolves to a list of movies with full details
 */
export function fetchMovieDetails(movieList) {
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
      appState.movies = movies_data
      saveToLocalStorage('movies', movies_data)
      return movies_data
    })
    .catch((error) => {
      console.error('Error fetching movie details:', error)
      return []
    })
}
