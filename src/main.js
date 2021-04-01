import { createSiteMenuTemplate } from './view/menu.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFilmDetailsTemplate } from './view/film-details.js';
import { createShowMoreButtonTemplate } from './view/showmore-button.js';
import { createUserTitleTemplate } from './view/user-title.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');
const allMoviesList = siteMainElement.querySelector('.films-list__container--all');
const topMoviesList = siteMainElement.querySelector('.films-list__container--top');
const commentedMoviesList = siteMainElement.querySelector('.films-list__container--commented');

render(siteMainElement, createSiteMenuTemplate(), 'afterbegin');
render(siteHeaderElement, createUserTitleTemplate(), 'beforeend');
render(siteBodyElement, createFilmDetailsTemplate(), 'beforeend');
render(allMoviesList, createShowMoreButtonTemplate(), 'afterend');

for(let i = 0; i < 5; i++) {
  render(allMoviesList, createFilmCardTemplate(), 'beforeend');
}

for(let i = 0; i < 2; i++) {
  render(topMoviesList, createFilmCardTemplate(), 'beforeend');
  render(commentedMoviesList, createFilmCardTemplate(), 'beforeend');
}


