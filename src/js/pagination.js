import { getPopular } from './popular.js';
import { getByName } from './search';
import { searched } from './search';
import { renderMarkup } from './popular.js';
const paginationBox = document.querySelector('.pagination-container');
let globalCurrentpage = 0;

export function pagination(currentPage, allPages) {
  let markup = '';
  let beforeTwoPage = currentPage - 2;
  let beforePage = currentPage - 1;
  let afterPage = currentPage + 1;
  let afterTwoPage = currentPage + 2;
  globalCurrentpage = currentPage;
  console.log('currentPage,allPage', currentPage, allPages);
  if (currentPage > 1) {
    markup += `<li class="pagination__item arrow-left" >&#129144;</li>`;
    markup += `<li class="pagination__item">1</li>`;
  }
  if (window.innerWidth >= 768) {
    if (currentPage > 4) {
      markup += `<li  class="pagination__item dotsLeft">...</span>`;
    }
    if (currentPage > 3) {
      markup += `<li  class="pagination__item">${beforeTwoPage}</li>`;
    }
    if (currentPage > 2) {
      markup += `<li  class="pagination__item">${beforePage}</li>`;
    }
    markup += `<li class="pagination__item pagination__item--active">${currentPage}</li>`;
    if (allPages - 1 > currentPage) {
      markup += `<li  class="pagination__item">${afterPage}</li>`;
    }
    if (allPages - 2 > currentPage) {
      markup += `<li class="pagination__item">${afterTwoPage}</li>`;
    }
    if (allPages - 3 > currentPage) {
      markup += `<li  class="pagination__item dotsRight">...</li>`;
    }
    if (allPages > currentPage) {
      markup += `<li  class="pagination__item">${allPages}</li>`;
      markup += `<li  class="pagination__item arrow-right">&#129146;</li>`;
    }
  } else {
    if (currentPage > 3) {
      markup += `<li  class="pagination__item">${beforeTwoPage}</li>`;
    }
    if (currentPage > 2) {
      markup += `<li  class="pagination__item">${beforePage}</li>`;
    }
    markup += `<li class="pagination__item pagination__item--active">${currentPage}</li>`;
    if (allPages - 1 > currentPage) {
      markup += `<li  class="pagination__item">${afterPage}</li>`;
    }
    if (allPages - 2 > currentPage) {
      markup += `<li class="pagination__item">${afterTwoPage}</li>`;
    }
    if (allPages > currentPage) {
      markup += `<li  class="pagination__item">${allPages}</li>`;
      markup += `<li  class="pagination__item arrow-right">&#129146;</li>`;
    }
  }
  if (!allPages) {
    markup = '';
  }
  paginationBox.innerHTML = markup;
  // window.scrollTo(0, 0);
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
paginationBox.addEventListener('click', handlerPagination);
function handlerPagination(evt) {
  if (!searched) {
    if (evt.target.nodeName !== 'LI') {
      return;
    }
    if (evt.target.textContent === '...') {
      return;
    }
    if (evt.target.textContent === '🡸') {
      getPopular((globalCurrentpage -= 1)).then(
        ({ results, page, total_pages }) => {
          renderMarkup(results);
          pagination(page, total_pages);
        }
      );
      return;
    }
    if (evt.target.textContent === '🡺') {
      getPopular((globalCurrentpage += 1)).then(
        ({ results, page, total_pages }) => {
          renderMarkup(results);
          pagination(page, total_pages);
        }
      );
      return;
    }
    //
    const page = evt.target.textContent;

    getPopular(page).then(({ results, page, total_pages }) => {
      renderMarkup(results);
      pagination(page, total_pages);
    });
  } else {
    if (evt.target.nodeName !== 'LI') {
      return;
    }
    if (evt.target.textContent === '...') {
      return;
    }
    if (evt.target.textContent === '🡸') {
      getByName(searched, (globalCurrentpage -= 1)).then(
        ({ results, page, total_pages }) => {
          renderMarkup(results);
          pagination(page, total_pages);
        }
      );
      return;
    }
    if (evt.target.textContent === '🡺') {
      getByName(searched, (globalCurrentpage += 1)).then(
        ({ results, page, total_pages }) => {
          renderMarkup(results);
          pagination(page, total_pages);
        }
      );
      return;
    }

    const page = evt.target.textContent;

    getByName(searched, page).then(({ results, page, total_pages }) => {
      renderMarkup(results);
      pagination(page, total_pages);
    });
  }
}
