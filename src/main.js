import SiteMenuView from './view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import FilmSectionView from './view/film-section.js';
import FilmListView from './view/film-list.js';
import FilmListTitleView from './view/film-list-title.js';
import UserTitleView from './view/user-title.js';
import FooterStatView from './view/footer-stat.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/showmore-button.js';
import { generateFilm } from './mock/film.js';
import { generateFilter } from './mock/filter.js';
import { renderElement, RenderPosition } from './utils.js';

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

/* MENU AND FILTERS */
const mainNavigationComponent = new SiteMenuView();

renderElement(
  siteMainElement,
  mainNavigationComponent.getElement(),
  RenderPosition.BEFOREEND,
);

renderElement(
  mainNavigationComponent.getElement(),
  new FilterView(filters).getElement(),
  RenderPosition.AFTERBEGIN,
);

/* SORTING */
renderElement(
  siteMainElement,
  new SortView().getElement(),
  RenderPosition.BEFOREEND,
);

/* FILM SECTION */
const filmSectionComponent = new FilmSectionView();

renderElement(
  siteMainElement,
  filmSectionComponent.getElement(),
  RenderPosition.BEFOREEND,
);

/* ALL FILM LIST */
const allFilmListComponent = new FilmListView();

renderElement(
  filmSectionComponent.getElement(),
  allFilmListComponent.getElement(),
  RenderPosition.BEFOREEND,
);

renderElement(
  allFilmListComponent.getElement(),
  new FilmListTitleView(true, 'All movies. Upcoming').getElement(),
  RenderPosition.AFTERBEGIN,
);

const allFilmContainer = allFilmListComponent.getFilmListContainer();

/* TOP RATED FILM LIST */
const topRatedFilmListComponent = new FilmListView(true);

renderElement(
  filmSectionComponent.getElement(),
  topRatedFilmListComponent.getElement(),
  RenderPosition.BEFOREEND,
);

renderElement(
  topRatedFilmListComponent.getElement(),
  new FilmListTitleView(false, 'Top rated').getElement(),
  RenderPosition.AFTERBEGIN,
);

/* ALL FILM LIST */
const mostCommentedFilmListComponent = new FilmListView(true);

renderElement(
  filmSectionComponent.getElement(),
  mostCommentedFilmListComponent.getElement(),
  RenderPosition.BEFOREEND,
);

renderElement(
  mostCommentedFilmListComponent.getElement(),
  new FilmListTitleView(false, 'Most commented').getElement(),
  RenderPosition.AFTERBEGIN,
);

/* USER TITLE */
renderElement(
  siteHeaderElement,
  new UserTitleView().getElement(),
  RenderPosition.BEFOREEND,
);

/* FOOTER STATISTICS */
renderElement(
  siteFooterElement,
  new FooterStatView(films.length).getElement(),
  RenderPosition.BEFOREEND,
);

/* ALL FILMS RENDERING */
for(let i = 1; i <= Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  const filmCardComponent = new FilmCardView(films[i]);

  renderElement(
    allFilmContainer,
    filmCardComponent.getElement(),
    RenderPosition.BEFOREEND);

  filmCardComponent.setOpenPopupEvent(siteBodyElement);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const allFilmShowMoreButton = new ShowMoreButtonView();

  renderElement(
    allFilmListComponent.getElement(),
    allFilmShowMoreButton.getElement(),
    RenderPosition.BEFOREEND,
  );

  allFilmShowMoreButton.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        const filmCardComponent = new FilmCardView(film);

        renderElement(
          allFilmContainer,
          filmCardComponent.getElement(),
          RenderPosition.BEFOREEND,
        );
        filmCardComponent.setOpenPopupEvent(siteBodyElement);},
      );

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if(renderedFilmCount >= films.length) {
      allFilmShowMoreButton.getElement().remove();
      allFilmShowMoreButton.removeElement();
    }
  });
}

/* TOP RATED FILMS RENDERING */

const topRatedFilmContainer = topRatedFilmListComponent.getFilmListContainer();

films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

const topRatedFilms = films.slice(0, 2);

topRatedFilms.forEach((film) => {
  const filmCardComponent = new FilmCardView(film);

  renderElement(
    topRatedFilmContainer,
    filmCardComponent.getElement(),
    RenderPosition.BEFOREEND);

  filmCardComponent.setOpenPopupEvent(siteBodyElement);
});

/* MOST COMMENTED FILMS RENDERING */

const mostCommentedFilmContainer = mostCommentedFilmListComponent.getFilmListContainer();

films.sort((a, b) => b.comments.length - a.comments.length);

const mostCommentedFilms = films.slice(0, 2);

mostCommentedFilms.forEach((film) => {
  const filmCardComponent = new FilmCardView(film);

  renderElement(
    mostCommentedFilmContainer,
    filmCardComponent.getElement(),
    RenderPosition.BEFOREEND);

  filmCardComponent.setOpenPopupEvent(siteBodyElement);
});

