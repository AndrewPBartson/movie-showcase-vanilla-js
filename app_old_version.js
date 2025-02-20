// OMDb API free tier - limited to 1,000 API calls per day

// import { appState, dispatch } from './state.js'
import { appState } from './state.js'
import { setupEventListeners } from './handlers.js'

const API_KEY = 'ccb97894'
const titleInput = 'indiana'

let movies_no_data = []
let movies_data = []

const main = (input) => {
  const savedMovies = JSON.parse(localStorage.getItem('movies')) || []
  console.log('Saved movies', savedMovies)

  // Part 1 - search for movies by title
  // returns matching movies but with minimal data per movie
  searchMoviesByTitle(input)
    .then((incoming) => {
      console.log('Initial results', incoming)
      return incoming // Pass the data forward
    })
    .then((movieList) => {
      // Part 2 - get complete movie details for selected movies
      return getMovieDetails(movieList)
    })
    .then((details) => {
      console.log('Complete movie details', details)
      localStorage.setItem('movies_data', JSON.stringify(details))
    })
}

// Part 1 - functions to search for movies by title
const searchMoviesByTitle = (titleInput) => {
  let currentPage = 1
  let totalPages = 1
  const baseUrl = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${titleInput}`
  return fetch(`${baseUrl}&page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      totalPages = Math.ceil(data.totalResults / 10)
      if (totalPages > 10) {
        totalPages = 10
      }
      movies_no_data = movies_no_data.concat(data.Search)
      return getRestOfMovies(baseUrl, totalPages)
    })
    .then(() => movies_no_data)
    .catch((error) => {
      console.error('Error fetching movies:', error)
    })
}

const getRestOfMovies = (baseUrl, totalPages) => {
  const promises = []
  for (let i = 1; i < totalPages; i++) {
    promises.push(fetchChunkOfMovies(baseUrl, i))
  }
  return Promise.all(promises).catch((error) => {
    console.error('Error fetching rest of the movies:', error)
  })
}

const fetchChunkOfMovies = (baseUrl, currentPage) => {
  return fetch(`${baseUrl}&page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      movies_no_data = movies_no_data.concat(data.Search)
    })
    .catch((error) => {
      console.error(`Error fetching movies on page ${currentPage}:`, error)
    })
}

// Part 2 - Functions to get complete movie details for selected movies

const fetchOneMovieDetails = (baseUrlForId, id) => {
  return fetch(`${baseUrlForId}${id}`)
    .then((res) => res.json())
    .then((data) => {
      movies_data.push(data)
    })
    .catch((error) => {
      console.error('Error fetching movie details:', error)
    })
}

const getMovieDetails = (movieList) => {
  if (!movieList || movieList.length === 0) {
    return Promise.resolve([]) // Prevents errors if no movies found
  }

  const baseUrlForId = `https://www.omdbapi.com/?apikey=${API_KEY}&i=`
  const promises = movieList
    // .slice(0, 40) // Need a better way to prevent exceeding array length
    .filter((movie) => movie && movie.imdbID) // Filter out undefined values
    .map((movie) => fetchOneMovieDetails(baseUrlForId, movie.imdbID))

  return Promise.all(promises)
    .then(() => movies_data)
    .catch((error) => {
      console.error('Error fetching rest of the movies:', error)
    })
}

// Part 3 - function to save data to local Storage

const searchLocalStorage = (item) => {
  let restricted = true // Sometimes I don't want everything from localStorage
  let results = localStorage.getItem(item)
  typeof results === 'string' ? (results = JSON.parse(results)) : (results = [])
  if (restricted) {
    // Option to return only first 40 results
    return results.slice(0, 40)
  }
  return results
}

// Set up event listeners
setupEventListeners(dispatch)

document.addEventListener('DOMContentLoaded', main)

//  TO DO lIST

// If "movies" is not found in local storage,
//   Fetch top movies using user's region to search by title

// After initial search, display the search term near the top of the page:
//   "You searched for: Indiana"

// Filters
// Create slider for filtering by year
// Add filter for "hasAward"

// Sorting
// Add button to sort by rating - descending of course
// Add button to sort by box office - descending of course

// Reset
// Add button to clear localStorage
// Add button to clear movies_no_data and movies_data
