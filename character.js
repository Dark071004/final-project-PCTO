import('./styles/style.scss')
import axios from 'axios'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'toastify-js/src/toastify.css'
import { showLoader, hideLoader } from './utils'

const page2 = document.getElementsByClassName('page2')[0]
const pageUrl = getCurrentURL()
let id = pageUrl.substring(pageUrl.lastIndexOf('?id=') + 4)
const charactersUrl = 'https://rickandmortyapi.com/api/character/' + id
const nameCharacter = document.getElementsByClassName('title')[0]
const imageCharacter = document
  .getElementsByClassName('card__imgCharacter')[0]
  .getElementsByTagName('img')[0]
const speciesCharacter = document.getElementsByClassName('species')[0]
const originCharacter = document.getElementsByClassName('origin')[0]
const statusCharacter = document.getElementsByClassName('status__name')[0]
const lastLocationCharacter = document.getElementsByClassName('lastLocation')[0]
const statusIconCharacter = document.getElementsByClassName('status__icon')[0]
const genderCharacter = document.getElementsByClassName('genderIcon')[0]
const nEpisodeCharacter = document.getElementsByClassName('nEpisode')[0]
const prevButton = document.getElementsByClassName('prevButtonCharacter')[0]
const nextButton = document.getElementsByClassName('nextButtonCharacter')[0]
const iconTheme = document.getElementsByClassName('iconTheme')[0]
const styleButton = document.getElementsByClassName('stylePage')[0]
const overlay = document.getElementsByClassName('overlay')[0]

getThemeFromLocalStorage()
showLoader()

function getCurrentURL() {
  return window.location.href
}
function fillCard(url) {
  showLoader(overlay)
  axios.get(url).then((data) => {
    const {
      name,
      image,
      species,
      location: { name: locationName },
      status,
      episode,
      gender,
      origin: { name: originName },
    } = data.data

    nameCharacter.innerHTML = name
    imageCharacter.src = image
    speciesCharacter.innerHTML = species
    // locationCharacter.innerHTML = episode
    originCharacter.innerHTML = originName
    statusCharacter.innerHTML = status
    lastLocationCharacter.innerHTML = locationName
    nEpisodeCharacter.innerHTML = episode.length + ' episodes'

    switch (status) {
      case 'Alive':
        statusIconCharacter.style.backgroundColor = 'lightgreen'
        break
      case 'Dead':
        statusIconCharacter.style.backgroundColor = 'red'
        break
      default:
        statusIconCharacter.style.backgroundColor = 'grey'
        break
    }

    if (gender === 'Male') {
      genderCharacter.innerHTML =
        '<span class="material-symbols-outlined" style="color:blue">male</span>'
    } else if (gender === 'Female') {
      genderCharacter.innerHTML =
        '<span class="material-symbols-outlined" style="color:red">female</span>'
    } else {
      genderCharacter.innerHTML =
        '<span class="material-symbols-outlined" style="color:gray">agender</span>'
    }

    hideLoader(overlay)
  })
}
function getCharacter() {
  console.log(id)
  if (parseInt(id) === 1) {
    prevButton.classList.add('disabledButton')
  }
  fillCard(charactersUrl)
}
function nextUrl() {
  const newId = parseInt(id) + 1
  const newUrl = 'https://rickandmortyapi.com/api/character/' + newId
  id = newId

  if (parseInt(id) !== 1) {
    prevButton.classList.remove('disabledButton')
  }
  fillCard(newUrl)
}
function prevUrl() {
  const newId = parseInt(id) - 1
  const newUrl = 'https://rickandmortyapi.com/api/character/' + newId
  id = newId

  if (parseInt(id) === 1) {
    prevButton.classList.add('disabledButton')
  }

  fillCard(newUrl)
}
function getThemeFromLocalStorage() {
  if (localStorage.getItem('theme') === 'dark') {
    page2.classList.add('dark-mode-page2')
    iconTheme.innerHTML = 'light_mode'
  } else {
    page2.classList.remove('dark-mode-page2')
    iconTheme.innerHTML = 'dark_mode'
  }
}
document.addEventListener('DOMContentLoaded', () => getCharacter())

nextButton.addEventListener('click', () => nextUrl())
prevButton.addEventListener('click', () => prevUrl())

styleButton.addEventListener('click', () => {
  page2.classList.toggle('dark-mode-page2')
  if (page2.classList.contains('dark-mode-page2')) {
    localStorage.setItem('theme', 'dark')
    iconTheme.innerHTML = 'light_mode'
  } else {
    localStorage.setItem('theme', 'light')
    iconTheme.innerHTML = 'dark_mode'
  }
})

tippy('.backButton', {
  content: 'Back to home page',
})

tippy('.stylePage', {
  content: 'Change theme',
})
tippy('.prevButtonCharacter', {
  content: 'Prev page',
})

tippy('.nextButtonCharacter', {
  content: 'Next page',
})
