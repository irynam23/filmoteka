import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { renderMarkup } from './popular';
import { pagination } from './pagination.js';
const searchForm = document.querySelector('.form');
const searchInput = document.querySelector('#search');
const notification = document.querySelector('.notification');
export let searched = '';
searchInput.addEventListener('keyup', event => {
  notification.classList.add('close');
});

searchForm.addEventListener('submit', searchFilm);

async function searchFilm(event) {
  event.preventDefault();
  Loading.standard();
  Loading.remove(800);
  const {
    elements: { search },
  } = event.currentTarget;
  searched = search.value;

  if (search.value.length < 2) {
    Notify.warning('Its name too short.Enter the correct movie name, please.');
    event.currentTarget.reset();
    searchInput.value = '';
    return;
  }
  try {
    const { results, page, total_pages } = await getByName(searched.trim(), 1);

    const cardsList = document.querySelector('.cards__list');
    if (cardsList) {
      cardsList.innerHTML = '';
    }
    if (Array.isArray(results) && results.length) {
      renderMarkup(results);
      pagination(1, total_pages);
    } else {
      notification.classList.remove('close');
      searchInput.value = '';
      pagination(0, 0);
    }
  } catch (error) {
    console.log(error);
  }
}
export async function getByName(name, page) {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=004aa31770cc2729c6dd319813b8b5dc&query=${name}&page=${page}`
  );

  return data;
}
