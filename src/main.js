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
  RenderPosition.AFTERBEGIN,
);

renderElement(
  allFilmListComponent.getElement(),
  new FilmListTitleView(true, 'All movies. Upcoming').getElement(),
  RenderPosition.AFTERBEGIN,
);

const allFilmContainer = allFilmListComponent.getFilmListContainer();

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

/* FILMS RENDERING */
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
