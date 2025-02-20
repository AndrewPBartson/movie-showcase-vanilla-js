// for now we have three import statements
import { appState } from './state.js'
import { loadMovies } from './api.js'
import { renderMovies } from './ui.js'

export function setupEventListeners(dispatch) {
  //   document.getElementById('search_form').addEventListener('submit', (event) => {
  //     event.preventDefault()
  //     const searchQuery = document.getElementById('search_title').value
  //     dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery })
  //     loadMovies(searchQuery, dispatch)
  //   })

  //   document
  //     .getElementById('filter_genre')
  //     .addEventListener('change', (event) => {
  //       dispatch({
  //         type: 'SET_FILTER',
  //         payload: { key: 'genre', value: event.target.value },
  //       })
  //       renderMovies(appState)
  //     })

  //   document
  //     .getElementById('filter_awards')
  //     .addEventListener('change', (event) => {
  //       dispatch({
  //         type: 'SET_FILTER',
  //         payload: { key: 'awards', value: event.target.checked },
  //       })
  //       renderMovies(appState)
  //     })
  // }

  const searchForm = document.getElementById('search_form')
  const searchTitle = document.getElementById('search_title')
  // const searchYear = document.getElementById('search_year')
  const searchIcon_1 = document.getElementById('search_icon_1')
  const searchIcon_2 = document.getElementById('search_icon_2')

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const searchQuery = document.getElementById('search_title').value
    // dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery })
    // loadMovies(searchQuery, dispatch)
    appState.searchQuery = searchQuery
    // await loadMovies(searchQuery) // bad syntax
    loadMovies(searchQuery) // might be ok
    renderMovies() // Refresh UI after data is loaded
  })

  document
    .getElementById('search_title')
    .addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        searchForm.dispatchEvent(new Event('submit'))
      }
    })

  // later add ability to add year to search
  // searchYear.addEventListener

  document.getElementById('search_icon_1').addEventListener('click', () => {
    searchForm.dispatchEvent(new Event('submit'))
  })

  document.getElementById('search_icon_2').addEventListener('click', () => {
    searchForm.dispatchEvent(new Event('submit'))
  })

  document
    .getElementById('filter_genre')
    .addEventListener('change', (event) => {
      // dispatch({
      //   type: 'SET_FILTER',
      //   payload: { key: 'genre', value: event.target.value },
      // })
      // renderMovies(appState)
      appState.filters.genre = event.target.value
      renderMovies()
    })

  document
    .getElementById('filter_awards')
    .addEventListener('change', (event) => {
      // dispatch({
      //   type: 'SET_FILTER',
      //   payload: { key: 'awards', value: event.target.checked },
      // })
      // renderMovies(appState)
      appState.filters.awards = event.target.checked
      renderMovies()
    })
}
