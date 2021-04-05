import { createSiteMenuTemplate } from './view/menu.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createFilmDetailsTemplate } from './view/film-details.js';
import { createShowMoreButtonTemplate } from './view/showmore-button.js';
import { createUserTitleTemplate } from './view/user-title.js';
import { createFooterStatTemplate } from './view/footer-stat.js';
import { generateFilm } from './mock/film.js';
import { generateFilter } from './mock/filter.js';

const FILM_COUNT = 20;
const SPECIAL_FILM_COUNT = 2;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm());
const topFilms = new Array(SPECIAL_FILM_COUNT).fill().map(() => generateFilm());
const commentedFilms = new Array(SPECIAL_FILM_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');
const allMoviesList = siteMainElement.querySelector('.films-list__container--all');
const topMoviesList = siteMainElement.querySelector('.films-list__container--top');
const commentedMoviesList = siteMainElement.querySelector('.films-list__container--commented');

render(siteMainElement, createSiteMenuTemplate(filters), 'afterbegin');
render(siteHeaderElement, createUserTitleTemplate(), 'beforeend');
render(siteFooterElement, createFooterStatTemplate(films), 'beforeend');
render(siteBodyElement, createFilmDetailsTemplate(films[0]), 'beforeend');

for(let i = 1; i <= Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(allMoviesList, createFilmCardTemplate(films[i]), 'beforeend');
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(allMoviesList, createShowMoreButtonTemplate(), 'afterend');

  const showMoreButton = siteMainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(allMoviesList, createFilmCardTemplate(film), 'beforeend'));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if(renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

for(const film of topFilms) {
  render(topMoviesList, createFilmCardTemplate(film), 'beforeend');
}

for(const film of commentedFilms) {
  render(commentedMoviesList, createFilmCardTemplate(film), 'beforeend');
}
