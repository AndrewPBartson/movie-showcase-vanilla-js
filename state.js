export const appState = {
  movies: [],
  filters: {
    genre: '',
    awards: false,
  },
  searchQuery: '',
  defaultSearch: 'Surprise',
}

// Mimic Redux with a dispatch function
// export function dispatch(action) {
//   switch (action.type) {
//     case 'SET_MOVIES':
//       appState.movies = action.payload
//       localStorage.setItem('movies', JSON.stringify(appState.movies)) // Save state
//       break

//     case 'SET_FILTER':
//       appState.filters[action.payload.key] = action.payload.value
//       break

//     case 'SET_SEARCH_QUERY':
//       appState.searchQuery = action.payload
//       break

//     default:
//       console.warn('Unknown action:', action)
//   }
// }
