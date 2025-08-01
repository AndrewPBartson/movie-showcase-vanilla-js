// for now, import appState
import { appState } from './state.js'

export function renderUI() {
  // refactorMovies()
  renderResultsTitle()
  renderSelectGenre()
  renderMovies()
}

function renderMovies() {
  console.log('appState.movies', appState.movies)
  const movieContainer = document.getElementById('movieContainer')
  movieContainer.innerHTML = ''

  // handle empty movies
  if (appState.movies.length === 0) {
    showNoResults('Please search for movies')
    return
  }

  const filteredMovies = appState.movies.filter((movie) => {
    if (
      appState.filters.genre &&
      !(
        movie.Genre.includes(appState.filters.genre) ||
        appState.filters.genre === 'All'
      )
    )
      return false

    if (appState.filters.awards && movie.Awards === 'N/A') return false

    return true
  })
  if (filteredMovies.length === 0) {
    showNoResults('Your filters returned no results')
    return
  }

  // filteredMovies = sortMovies(filteredMovies, appState.sort)

  // render a skeleton for each card first
  filteredMovies.forEach(() => {
    const skeleton = document.createElement('div')
    skeleton.className = 'movie-card skeleton'
    skeleton.innerHTML = `
      <div class="poster-wrapper"></div>
      <div class="movie-info"></div>
    `
    movieContainer.appendChild(skeleton)
  })

  // then create real cards once images load
  filteredMovies.forEach((movie, index) => {
    const realCard = renderCard(movie)
    const poster = realCard.querySelector('.movie-poster')

    poster.onload = () => {
      const skeleton = movieContainer.children[index]
      movieContainer.replaceChild(realCard, skeleton)
    }

    poster.onerror = () => {
      const skeleton = movieContainer.children[index]
      movieContainer.replaceChild(realCard, skeleton)
    }
  })
}

function renderSelectGenre() {
  const selectGenre = document.getElementById('filter_genre')
  selectGenre.innerHTML = ''

  const currentGenre = appState.filters.genre || 'All'

  const optionAll = document.createElement('option')
  optionAll.value = 'All'
  optionAll.textContent = 'All'
  if (currentGenre === 'All') optionAll.selected = true
  selectGenre.appendChild(optionAll)

  const uniqueGenres = getAllGenres(appState.movies)

  uniqueGenres.forEach((genre) => {
    const option = document.createElement('option')
    option.value = genre
    option.textContent = genre
    if (genre === currentGenre) option.selected = true
    selectGenre.appendChild(option)
  })
}

const getAllGenres = (movies) => {
  const genreSet = new Set()
  movies.forEach((movie) => {
    const genres = movie.Genre.split(', ')
    genres.forEach((g) => genreSet.add(g))
  })
  return Array.from(genreSet).sort()
}

const showNoResults = (text) => {
  const movieContainer = document.getElementById('movieContainer')
  const noResultsCaption = document.createElement('p')
  noResultsCaption.textContent = text
  const noResultsImage = document.createElement('img')
  noResultsImage.classList.add('no_results_image')
  noResultsImage.src = './img/no_results.jpg'
  noResultsImage.alt = 'Confused person with binoculars'
  movieContainer.innerHTML = ''
  movieContainer.classList.add('no_results')
  movieContainer.appendChild(noResultsCaption)
  movieContainer.appendChild(noResultsImage)
  return
}

const renderResultsTitle = () => {
  const resultsTitle = document.getElementById('results_title')
  resultsTitle.textContent = `Results for "${appState.searchQuery}"`
}

function createInfoRow(icon, labelText, valueText) {
  const row = document.createElement('p')
  row.className = 'info-row'

  const iconSpan = document.createElement('span')
  iconSpan.className = 'info-icon'
  iconSpan.textContent = icon

  const label = document.createElement('span')
  label.className = 'info-label'
  label.textContent = `${labelText}: `

  const value = document.createElement('span')
  value.className = 'info-value'
  value.textContent = valueText

  row.append(iconSpan, label, value)
  return row
}

function renderCard(movie) {
  const card = document.createElement('div')
  card.className = 'movie-card'

  const posterWrapper = document.createElement('div')
  posterWrapper.className = 'poster-wrapper'

  const fallbackSrc = './img/image_hijacked.jpg'
  const altText = `${movie.Title} Poster`
  const poster = loadPosterSafely(movie.Poster, fallbackSrc, altText)

  posterWrapper.appendChild(poster)

  const overlay = document.createElement('div')
  overlay.className = 'poster-overlay'
  overlay.innerHTML = `More Info <i class="fas fa-arrow-right"></i>`
  overlay.addEventListener('click', (e) => {
    e.preventDefault()
    alert('This feature has not been implemented.')
  })

  posterWrapper.appendChild(overlay)

  const info = document.createElement('div')
  info.className = 'movie-info'

  const title = document.createElement('h3')
  title.textContent = `${movie.Title} (${movie.Year})`
  info.appendChild(title)

  if (movie.Director !== 'N/A')
    info.appendChild(createInfoRow('🎬', 'Director', movie.Director))
  if (movie.Actors !== 'N/A')
    info.appendChild(createInfoRow('🧑‍🤝‍🧑', 'Actors', movie.Actors))
  if (movie.Genre !== 'N/A')
    info.appendChild(createInfoRow('🎭', 'Genre', movie.Genre))
  if (movie.Awards !== 'N/A')
    info.appendChild(createInfoRow('🏆', 'Awards', movie.Awards))
  if (movie.Plot !== 'N/A')
    info.appendChild(createInfoRow('📝', 'Plot', movie.Plot))

  card.append(posterWrapper, info)

  return card
}

export function loadPosterSafely(posterUrl, fallbackSrc, altText) {
  const image = document.createElement('img')
  image.className = 'movie-poster'
  image.alt = altText
  image.src = fallbackSrc // Start with the Goddess

  // Load the intended image *off-DOM*
  const testImg = new Image()
  testImg.src = posterUrl

  testImg.onload = () => {
    const isSuspicious =
      testImg.naturalWidth < 100 || testImg.naturalHeight < 100
    const isClearlyValid = testImg.naturalWidth >= 100

    if (isClearlyValid && !isSuspicious) {
      image.src = posterUrl // Replace with valid poster
    } else {
      console.warn('Suspicious poster dimensions:', testImg.naturalWidth)
    }
  }

  testImg.onerror = () => {
    console.warn('Poster failed to load:', posterUrl)
    // The Goddess remains untouched
  }

  return image
}

export function startLoading() {
  document.querySelector('.progress-bar').style.animationPlayState = 'running'
  renderSkeletonCards(6)
}

export function stopLoading() {
  const progressBar = document.querySelector('.progress-bar')
  progressBar.style.animation = 'none'

  const allImages = [...document.querySelectorAll('.movie-poster')]
  let loadedCount = 0

  allImages.forEach((img) => {
    if (img.complete) {
      loadedCount++
    } else {
      img.onload = img.onerror = () => {
        loadedCount++
        if (loadedCount === allImages.length) {
          finalize()
        }
      }
    }
  })

  if (loadedCount === allImages.length) finalize()

  function finalize() {
    document
      .querySelectorAll('.movie-card.skeleton')
      .forEach((el) => el.remove())
    // Re-enable scroll, hide overlay, etc. if needed
  }
}

function renderSkeletonCards(count = 6) {
  const movieContainer = document.getElementById('movieContainer')
  movieContainer.innerHTML = ''
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div')
    skeleton.className = 'movie-card skeleton'

    const poster = document.createElement('div')
    poster.className = 'poster-wrapper'

    const info = document.createElement('div')
    info.className = 'movie-info'

    skeleton.append(poster, info)
    movieContainer.appendChild(skeleton)
  }
}
