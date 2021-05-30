import FooterStatView from './view/footer-stat.js';
import FilmSectionPresenter from './presenter/film-section.js';
import FilmsModel from './model/films.js';
import { render, RenderPosition } from './utils/render.js';
import { UpdateType } from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic hello';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const filmsModel = new FilmsModel();

const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteMainElement = document.querySelector('.main');

const api = new Api(END_POINT, AUTHORIZATION);

/* FILMS AND FILTERS */
const filmSectionPresenter = new FilmSectionPresenter(
  siteMainElement,
  filmsModel,
  api,
  siteHeaderElement,
);

filmSectionPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    /* FOOTER STATISTICS */
    render(
      siteFooterElement,
      new FooterStatView(films.length),
      RenderPosition.BEFOREEND,
    );
  });

