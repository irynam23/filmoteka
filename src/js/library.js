import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { Loading } from 'notiflix/build/notiflix-loading-aio';

const cardsList = document.querySelector('.cards__list');
const watchedBtn = document.querySelector('.filter-watched__btn');
const queueBtn = document.querySelector('.filter-queue__btn');
// const cardsRemoveItem = document.querySelector('.cards__remove-item');
let currentTab = '';

watchedBtn.addEventListener('click', renderWatched);
queueBtn.addEventListener('click', renderQueue);

if (window.location.pathname === '/library.html' || '/project/library.html') {
  watchedBtn.focus();
  watchedBtn.click();
}

function renderWatched() {
  currentTab = 'watched';
  Loading.standard();
  Loading.remove(800);
  cardsList.innerHTML = '';
  const watchedMovies = JSON.parse(localStorage.getItem('watched')) || [];
  if (!watchedMovies.length) {
    return Notify.info('No added movies!');
  }
  renderMarkupLibrary(watchedMovies);
}

function renderQueue() {
  currentTab = 'queue';
  Loading.standard();
  Loading.remove(800);
  cardsList.innerHTML = '';
  const queueMovies = JSON.parse(localStorage.getItem('queue')) || [];
  if (!queueMovies.length) {
    return Notify.info('No added movies!');
  }
  renderMarkupLibrary(queueMovies);
}

function renderMarkupLibrary(movies) {
  const markup = movies
    .map(movie => {
      return `<li class="cards__item" data-id="${movie.id}">

     
          <button type="submit" class="cards__remove-item" data-id="${
            movie.id
          }">-</button>
      <img
            class="cards__photo"
            alt="movie"
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            
            loading="lazy"
          />
          <h3 class="cards__title">${movie.title}</h3>
          <p class="cards__info">${getGenresNameLibrary(movie.genres).join(
            ', '
          )} | ${
        movie.release_date.split('-')[0]
      } <span class="cards__vote"> ${movie.vote_average.toFixed(1)}</span></p>
        </li>`;
    })
    .join('');
  cardsList.insertAdjacentHTML('beforeend', markup);
  const cardsRemoveItem = document.querySelectorAll('.cards__remove-item');
  cardsRemoveItem.forEach(btn => {
    btn.addEventListener('click', onBtn);
  });
}

function onBtn(e) {
  const movieId = Number(e.target.dataset.id);
  console.log(movieId);
  switch (currentTab) {
    case 'watched':
      cardsList.innerHTML = '';
      const watchedMovies = JSON.parse(localStorage.getItem('watched'));
      const filteredW = watchedMovies.filter(({ id }) => id !== movieId);
      console.log(filteredW);
      localStorage.setItem('watched', JSON.stringify(filteredW));
      if (!filteredW.length) {
        return Notify.info('No added movies!');
      }
      renderMarkupLibrary(filteredW);
      break;
    case 'queue':
      cardsList.innerHTML = '';
      const queueMovies = JSON.parse(localStorage.getItem('queue'));
      const filteredQ = queueMovies.filter(({ id }) => id !== movieId);
      localStorage.setItem('queue', JSON.stringify(filteredQ));
      if (!filteredQ.length) {
        return Notify.info('No added movies!');
      }
      renderMarkupLibrary(filteredQ);
      break;
    default:
      break;
  }
}

function getGenresNameLibrary(movieGenres) {
  const genresName = movieGenres.map(genre => genre.name);
  return genresName.length > 2 ? genresName.slice(0, 2) : genresName;
}
