'use strict';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { VideoTrailer } from './trailer';

const cardsList = document.querySelector('.cards__list');

const modalBackdrop = document.querySelector('.backdrop__modal-film');
const buttonCloseModal = document.querySelector('#modal-close-button');
const modalCardInfo = document.querySelector('.modal-film__info');
const btnWatched = document.querySelector('.modal-film__btn-watched');
const btnQueue = document.querySelector('.modal-film__btn-queue');
// const filterWatched = document.querySelector(".filter-watched__btn");
// const filterQueue = document.querySelector(".filter-queue__btn");
const libraryWatched = JSON.parse(localStorage.getItem('watched')) || [];
const libraryQueue = JSON.parse(localStorage.getItem('queue')) || [];

const videoTrailer = new VideoTrailer();

cardsList.addEventListener('click', onOpenModal);

btnWatched.addEventListener('click', setToLocalStorageWatched);
btnQueue.addEventListener('click', setToLocalStorageQueue);
// filterWatched.addEventListener('click', onfilterWatched);
// filterQueue.addEventListener('click', onfilterQueue)

async function onOpenModal(event) {
  if (!event.target.closest('[data-id]')) {
    return;
  }

  if (event.target.nodeName === 'BUTTON') {
    return;
  }
  modalBackdrop.classList.add('is-hidden');
  modalCardInfo.innerHTML = '';
  clearBackdropListeners();

  const currentCardId = event.target.closest('li').dataset.id;
  const movieRes = await addMovieInfo(currentCardId);
  createMovieCard(movieRes);

  setTimeout(() => {
    videoTrailer.rootSelector = modalBackdrop.querySelector('iframe');
  });

  modalBackdrop.classList.remove('is-hidden');
  window.addEventListener('click', closeModalbyBackdrop);
  window.addEventListener('keydown', onKeyClick);
  buttonCloseModal.addEventListener('click', closeModalbyCross);
}

async function addMovieInfo(id) {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=004aa31770cc2729c6dd319813b8b5dc`
  );
  return data;
}

function closeModalbyCross() {
  const modalCardInfo = document.querySelector('.modal__trailer');
  modalCardInfo.innerHTML = '';
  // videoTrailer.stop();
  modalBackdrop.classList.add('is-hidden');
  modalCardInfo.innerHTML = '';
  clearBackdropListeners();
}

function onKeyClick(event) {
  if (event.code !== 'Escape') {
    return;
  }
  modalBackdrop.classList.add('is-hidden');
  modalCardInfo.innerHTML = '';
  clearBackdropListeners();
}

function closeModalbyBackdrop(event) {
  if (event.target === modalBackdrop) {
    videoTrailer.stop();
    modalBackdrop.classList.add('is-hidden');
    modalCardInfo.innerHTML = '';
    clearBackdropListeners();
  }
}

function clearBackdropListeners() {
  window.removeEventListener('keydown', onKeyClick);
  window.removeEventListener('click', closeModalbyBackdrop);
  buttonCloseModal.removeEventListener('click', closeModalbyCross);
}

function createMovieCard(obj) {
  const {
    id,
    title,
    vote_average,
    vote_count,
    popularity,
    original_title,
    overview,
    genres,
    poster_path,
  } = obj;
  const genresArr = genres.map(el => el.name);

  const markup = ` 
      <div class="film-card"> 
          <div class="film-card__picture-container">
              <img class="film-card__picture" src="https://image.tmdb.org/t/p/w300${poster_path}" alt="${title}" data-id="${id}"> 
          </div>
          <div class="film-card__info-container">
            <h2 class="film-card__title">${title}</h2> 
            <ul class="film-card__info-list">
              <li class="film-card__info-el">
                  <p class="film-card__info-item">Vote / Votes</p>
                  <p class="film-card__info-item--value">
                    <span class="info-item__highlight-orange">${vote_average.toFixed(
                      1
                    )}</span> / 
                    <span class="info-item__highlight-grey">${vote_count.toFixed()}</span>
                  </p>
              </li>
              <li class="film-card__info-el">
                <p class="film-card__info-item">Popularity</p>
                <p class="film-card__info-item--value">${popularity.toFixed(
                  1
                )}</p>
              </li>
              <li class="film-card__info-el">
                <p class="film-card__info-item">Original Title</p>
                <p class="film-card__info-item--value">${original_title.toUpperCase()}</p>
              </li>
              <li class="film-card__info-el">
              <p class="film-card__info-item">Genre</p>
              <p class="film-card__info-item--value">${[...genresArr].join(
                ', '
              )}</p>
              </li>
            </ul>
            <p class="film-card__overview-title">About</p>
            <p class="film-card__overview">${overview}</p> 
            </div>
        </div>
       
    `;
  modalCardInfo.insertAdjacentHTML('beforeend', markup);
}

async function setToLocalStorageWatched(evt) {
  const idWatched =
    evt.currentTarget.parentNode.previousElementSibling.firstElementChild
      .firstElementChild.firstElementChild.dataset.id;

  if (libraryWatched.some(movie => movie.id === Number(idWatched))) {
    Notify.warning('This film have already add to watched list');

    return;
  }
  const currentFilm = await addMovieInfo(idWatched);

  libraryWatched.push(currentFilm);

  try {
    const valueToSet = JSON.stringify(libraryWatched);
    localStorage.setItem('watched', valueToSet);
    Notify.success(`${currentFilm.title} added to WATCHED!`);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
}

async function setToLocalStorageQueue(evt) {
  const idQueue =
    evt.currentTarget.parentNode.previousElementSibling.firstElementChild
      .firstElementChild.firstElementChild.dataset.id;

  if (libraryQueue.some(movie => movie.id === Number(idQueue))) {
    Notify.warning('This film have already add to queue list');
    return;
  }
  const currentFilm = await addMovieInfo(idQueue);
  libraryQueue.push(currentFilm);

  try {
    const valueToSet = JSON.stringify(libraryQueue);
    localStorage.setItem('queue', valueToSet);
    Notify.success(`${currentFilm.title} added to QUEUE!`);
  } catch (error) {
    console.error('Set state error: ', error.message);
  }
  const queue = JSON.parse(localStorage.getItem('queue'));
}
