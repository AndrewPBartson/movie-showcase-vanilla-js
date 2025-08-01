import { appState } from './state.js'

export const refactorMovies = (movies) => {
  console.log('Refactoring')
  movies.forEach((movie) => {
    if (movie.BoxOffice) {
      movie.boxOfficeInt = convertBoxOfficeToInt(movie.BoxOffice)
    }
    if (movie.imdbRating) {
      movie.ratingInt = convertRatingToInt(movie.imdbRating)
    }
    if (movie.Year) {
      movie.yearInt = convertYearToInt(movie.Year)
    }
  })
  return movies
}

const convertBoxOfficeToInt = (dollarsText) => {
  const result = parseInt(dollarsText.replace(/[$,]/g, ''))
  if (isNaN(result)) return 0
  return result
}

const convertRatingToInt = (rating) => {
  const result = parseFloat(rating)
  if (isNaN(result)) return 0
  return parseInt(result * 10)
}

const convertYearToInt = (year) => {
  const result = parseInt(year)
  if (isNaN(result)) return 0
  return result
}

export function saveMovies(movies) {
  appState.movies = movies
  appState.originalMovies = [...movies]
  saveToLocalStorage('movies', movies)
}

export function saveSearchQuery(searchQuery) {
  appState.searchQuery = searchQuery
  saveToLocalStorage('searchQuery', searchQuery)
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || []
}
