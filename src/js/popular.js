import axios from 'axios';
import { pagination } from './pagination.js';
export const cardsList = document.querySelector('.cards__list');
let TOTAL_PAGES = 0;
let page = 1;

if (window.location.pathname !== '/library.html') {
  loadPopular();
}

let GENRES = [];

export async function getPopular(page = 1) {
  const { data } = await axios.get(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=004aa31770cc2729c6dd319813b8b5dc&page=${page}`
  );

  return data;
}

export function renderMarkup(movies) {
  cardsList.innerHTML = '';
  const markup = movies
    .map(movie => {
      return `<li class="cards__item" data-id="${movie.id}">

     
          <img
            class="cards__photo"
            alt="movie"
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            
            loading="lazy"
          />
          <h3 class="cards__title">${movie.title}</h3>
          <p class="cards__info">${getGenresName(GENRES, movie.genre_ids).join(
            ', '
          )} | ${movie.release_date.split('-')[0]}</p>
        </li>`;
    })
    .join('');
  cardsList.insertAdjacentHTML('beforeend', markup);
}

async function loadPopular() {
  try {
    const { results, page, total_pages } = await getPopular();
    GENRES = await getGenres();
    renderMarkup(results);
    pagination(1, total_pages);
  } catch (error) {
    console.log(error);
  }
}

export async function getGenres() {
  const { data } = await axios.get(
    'https://api.themoviedb.org/3/genre/movie/list?api_key=004aa31770cc2729c6dd319813b8b5dc'
  );
  return data.genres;
}

export function getGenresName(allGenres, genreIds) {
  const genresName = allGenres.reduce((acc, genre) => {
    if (genreIds.includes(genre.id)) {
      return [...acc, genre.name];
    }
    return acc;
  }, []);
  return genresName.length > 2 ? genresName.slice(0, 2) : genresName;
}
