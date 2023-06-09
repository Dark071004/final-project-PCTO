import('./styles/style.scss')
import axios from 'axios'
import Toastify from 'toastify-js'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'toastify-js/src/toastify.css'
import { hideLoader, showLoader } from './utils'

const charactersUrl = 'https://rickandmortyapi.com/api/character/'
// Crea una variabile e metti dentro la tabella
const table = document
  .getElementsByClassName('tableCharacters')[0]
  .getElementsByTagName('table')[0]
  .getElementsByTagName('tbody')[0]
const prevButton = document.getElementsByClassName('prevButton')[0]
const nextButton = document.getElementsByClassName('nextButton')[0]
const numberOfPage = document.getElementsByClassName('pageNumber')[0]
const searchInput = document.getElementsByClassName('searchBar__inputText')[0]
const searchButton = document.getElementsByClassName(
  'searchBar__buttonSearch'
)[0]
const foundCharacter = document.getElementsByClassName('foundCharacterText')[0]
let pageCount = 1
const formTextInput = document.getElementsByClassName('searchBar')[0]
const imageError = document.getElementsByClassName('errorImage')[0]
let countCharacter
const styleButton = document.getElementsByClassName('stylePage')[0]
const page = document.getElementsByClassName('page')[0]
const iconTheme = document.getElementsByClassName('iconTheme')[0]
const randomButton = document.getElementsByClassName('randomCharacter')[0]
const overlay = document.getElementsByClassName('overlay')[0]

getThemeFromLocalStorage()
showLoader(overlay)
initTooltips()

function initTooltips() {
  tippy('.randomCharacter', {
    content: 'Random Character',
  })
  tippy('.stylePage', {
    content: 'Change theme',
  })

  tippy('.prevButton', {
    content: 'Prev page',
  })

  tippy('.nextButton', {
    content: 'Next page',
  })
}

function getToast() {
  Toastify({
    text: 'Error, no characters found',
    duration: 5000,
    newWindow: true,
    close: false,
    gravity: 'top', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      height: '70px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px',
      borderRadius: '40px',
      background: 'rgb(255,149,0)',
      background:
        'linear-gradient(266deg, rgba(255,149,0,1) 0%, rgba(223,64,64,1) 100%)',
    },
    className: 'toast-error',
  }).showToast()
}

function getCharacters(pageNumber, nameCharacter) {
  showLoader(overlay)
  pageCount = pageNumber || 1
  numberOfPage.innerHTML = pageNumber || 1

  // Disable prev button when pageNumber is 1 so user can not go to '0' page
  disablePrevButton()

  table.innerHTML = ''
  axios
    .get(charactersUrl, {
      params: {
        page: pageNumber || 1,
        name: nameCharacter || '',
      },
    })
    .then((data) => {
      populateCharactersTable(data)
    })
    .catch(() => {
      handleError()
    })
}

function handleError() {
  hideLoader(overlay)

  countCharacter = 0
  foundCharacter.innerHTML = 'Found characters: 0'
  if (pageCount === 1) {
    prevButton.disabled = true
    prevButton.classList.add('disabledButton')
  }

  if (countCharacter === 0) {
    imageError.style.display = 'initial'
  } else {
    imageError.style.display = 'none'
  }

  nextButton.disabled = true
  nextButton.classList.add('disabledButton')

  getToast()
}

function getThemeFromLocalStorage() {
  if (localStorage.getItem('theme') === 'dark') {
    page.classList.add('dark-mode-page')
    iconTheme.innerHTML = 'light_mode'
  } else {
    page.classList.remove('dark-mode-page')
    iconTheme.innerHTML = 'dark_mode'
  }
}

function nextPage() {
  getCharacters(++pageCount, searchInput.value)
  numberOfPage.innerHTML = pageCount
}

function prevPage() {
  getCharacters(--pageCount, searchInput.value)
  numberOfPage.innerHTML = pageCount
  nextButton.disabled = false
  nextButton.classList.remove('disabledButton')
}

function disablePrevButton() {
  if (pageCount === 1) {
    prevButton.disabled = true
    prevButton.classList.add('disabledButton')
  } else {
    prevButton.disabled = false
    prevButton.classList.remove('disabledButton')
  }
}

function populateCharactersTable(data) {
  imageError.style.display = 'none'
  data.data.results.forEach((character) => {
    const newRow = document.createElement('tr')
    const { image, name, status, species, id } = character
    const fields = [image, name, status, species]
    fields.forEach((field, i) => {
      const newCell = document.createElement('td')
      if (i === 1) {
        const nameLink = document.createElement('a')
        nameLink.href = `./character.html?id=${id}`
        nameLink.innerHTML = field
        nameLink.classList.add('nameLink')
        newCell.append(nameLink)
      } else if (i === 2) {
        newCell.style.gap = '15px'
        const newDiv = document.createElement('div')
        newDiv.innerHTML = field
        const iconStatus = document.createElement('span')
        iconStatus.classList.add('status__icon')

        if (status === 'Alive') {
          iconStatus.style.backgroundColor = 'light-green'
        } else if (status === 'Dead') {
          iconStatus.style.backgroundColor = 'red'
        } else {
          iconStatus.style.backgroundColor = 'grey'
        }

        newCell.append(newDiv, iconStatus)
      } else if (i !== 0) {
        newCell.innerHTML = field
      } else {
        const charachterImage = document.createElement('img')
        charachterImage.src = field
        charachterImage.classList.add('iconCharacter')
        newCell.append(charachterImage)
      }
      newRow.append(newCell)
    })
    table.append(newRow)
  })

  const count = data.data.info.count
  countCharacter = count
  if (!!searchInput.value) {
    foundCharacter.innerHTML =
      'Found characters for ' + searchInput.value + ' : ' + countCharacter
  } else {
    foundCharacter.innerHTML = 'Found characters : ' + count
  }

  if (pageCount === 1) {
    prevButton.disabled = true
    prevButton.classList.add('disabledButton')
    nextButton.disabled = false
    nextButton.classList.remove('disabledButton')
  } else {
    prevButton.disabled = false
    prevButton.classList.remove('disabledButton')
  }

  hideLoader(overlay)
}

// quando il dom è pronto, chiama il server
document.addEventListener('DOMContentLoaded', () => getCharacters())

prevButton.addEventListener('click', prevPage)

nextButton.addEventListener('click', nextPage)

searchInput.addEventListener('input', (e) => {})

searchButton.addEventListener('click', () => {
  getCharacters(1, searchInput.value)
})

formTextInput.addEventListener('submit', (e) => {
  e.preventDefault()
})

styleButton.addEventListener('click', () => {
  page.classList.toggle('dark-mode-page')
  if (page.classList.contains('dark-mode-page')) {
    localStorage.setItem('theme', 'dark')
    iconTheme.innerHTML = 'light_mode'
  } else {
    localStorage.setItem('theme', 'light')
    iconTheme.innerHTML = 'dark_mode'
  }
})

randomButton.addEventListener('click', () => {
  const randomNumber = Math.floor(Math.random() * countCharacter)
  console.log(randomNumber)
  window.location.href = `./character.html?id=${randomNumber}`
})
