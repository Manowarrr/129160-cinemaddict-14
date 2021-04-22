import SiteMenuView from './view/menu.js';
import FilterView from './view/filter.js';
import UserTitleView from './view/user-title.js';
import FooterStatView from './view/footer-stat.js';
import FilmSectionPresenter from './presenter/film-section.js';
import { generateFilm } from './mock/film.js';
import { generateFilter } from './mock/filter.js';
import { render, RenderPosition } from './utils/render.js';

const FILM_COUNT = 20;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');

/* MENU AND FILTERS */
const mainNavigationComponent = new SiteMenuView();

render(
  siteMainElement,
  mainNavigationComponent,
  RenderPosition.BEFOREEND,
);

render(
  mainNavigationComponent,
  new FilterView(filters),
  RenderPosition.AFTERBEGIN,
);

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

/* FILM SECTION PRESENTER */

const filmSectionPresenter = new FilmSectionPresenter(siteMainElement);

filmSectionPresenter.init(films);
