'use strict';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const cardsList = document.querySelector('.cards__list');

const YOUTUBE = 'https://www.youtube.com/embed/';

cardsList.addEventListener('click', createTrailer);
const modalCardInfo = document.querySelector('.modal__trailer');

//function by click on image
async function createTrailer(event) {
  const currentId = event.target.parentNode.dataset.id; // const id of film

  addMovieInfo(currentId);
  // //Find all info about film, get object
  async function addMovieInfo(id) {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=daf1fe8995a61d2fecc007eaa464ca98`
    );
    modalCardInfo.innerHTML = '';
    let key = '';
    createMovieTrailer(data);

    function createMovieTrailer(obj) {
      const { results } = obj;
      results.forEach(res => {
        if (res.name.includes('Official')) {
          return (key = res.key);
        }
      });

      modalCardInfo.innerHTML = `
         <iframe
          class="trailer__video"
           src="${YOUTUBE}${key}"
          title="YouTube player"
          frameborder="0"
          allow="acc"
            width="640"
            height="360"
          ></iframe>
        `;
    }
  }
}

// <h2 class="modal-filmoteka__title title">
//   Watch trailer
// </h2>
export class VideoTrailer {
  constructor() {
    this.rootSelector = null;
  }

  stop() {
    
    this.rootSelector.contentWindow.close();
  }
}
export const stopVideo = () => { 
  const iframe = modalCardInfo.querySelector(".trailer__video");
  
  
  iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', 
  func: 'stopVideo' }), '*') 
    
}

