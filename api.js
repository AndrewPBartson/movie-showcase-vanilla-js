const OMDB_API_KEY = 'ccb97894'
const BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`

import { appState } from './state.js'
import { saveToLocalStorage } from './utils.js'

export async function fetchAllMovies(query) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`
  )
  const data = await response.json()
  return data.Search || []
}

export async function fetchMovieDetails(imdbID) {
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`
  )
  return response.json()
}

export async function loadMovies(query) {
  const movies = await fetchAllMovies(query)
  const detailedMovies = await Promise.all(
    movies.map((movie) => fetchMovieDetails(movie.imdbID))
  )
  return detailedMovies
}

export const initializeSearchQuery = () => {
  return fetch('https://geolocation-db.com/json/')
    .then((response) => response.json())
    .then((data) => {
      let location
      location = 'Oregon'
      // location = data.country_name
      // location = data.city
      // location = data.state
      console.log(location)
      appState.searchQuery = location || appState.defaultSearch
      return location
    })
    .catch((error) => {
      console.error('Error fetching location:', error)
      appState.searchQuery = appState.defaultSearch
    })
}
