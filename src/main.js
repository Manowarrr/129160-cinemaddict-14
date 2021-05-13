import UserTitleView from './view/user-title.js';
import FooterStatView from './view/footer-stat.js';
import SiteMenuView from './view/menu.js';
import FilterPresenter from './presenter/filter.js';
import FilmSectionPresenter from './presenter/film-section.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import { generateFilm } from './mock/film.js';
import { render, RenderPosition } from './utils/render.js';

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm());

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

/* USER TITLE */
render(
  siteHeaderElement,
  new UserTitleView(),
  RenderPosition.BEFOREEND,
);

/* FOOTER STATISTICS */
render(
  siteFooterElement,
  new FooterStatView(films.length),
  RenderPosition.BEFOREEND,
);

/* FILTER */
const mainNavigationComponent = new SiteMenuView();

render(
  siteMainElement,
  mainNavigationComponent,
  RenderPosition.BEFOREEND,
);

const filterPresenter = new FilterPresenter(
  mainNavigationComponent,
  filterModel,
  filmsModel,
);

filterPresenter.init();


/* FILM SECTION PRESENTER */

const filmSectionPresenter = new FilmSectionPresenter(
  siteMainElement,
  filmsModel,
  filterModel,
);

filmSectionPresenter.init();
