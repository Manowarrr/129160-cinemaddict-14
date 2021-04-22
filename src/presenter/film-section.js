import SortView from '../view/sort.js';
import FilmSectionView from '../view/film-section.js';
import FilmListView from '../view/film-list.js';
import FilmListTitleView from '../view/film-list-title.js';
import FilmPresenter from './film.js';
import ShowMoreButtonView from '../view/showmore-button.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;

const getTopRatedFilms = (films) => {
  return films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating)
    .slice(0, 2);
};

const getMostCommentedFilms = (films) => {
  return films.sort((a, b) => b.comments.length - a.comments.length)
    .slice(0, 2);
};

export default class FilmSection {
  constructor(filmSectionContainer) {
    this._filmSectionContainer = filmSectionContainer;

    this._filmSectionComponent = new FilmSectionView();
    this._sortComponent = new SortView();
    this._allFilmListComponent = new FilmListView();
    this._emptyFilmListComponent = new FilmListView(true);
    this._topRatedFilmListComponent = new FilmListView(true);
    this._mostCommentedFilmListComponent = new FilmListView(true);
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);

    this._filmPresenter = {};
  }

  init(films) {
    this._films = films.slice();
    this._topRatedFilms = getTopRatedFilms(films.slice());
    this._mostCommentedFilms = getMostCommentedFilms(films.slice());

    this._renderSort();

    render(
      this._filmSectionContainer,
      this._filmSectionComponent,
      RenderPosition.BEFOREEND,
    );

    this._renderFilmList(
      this._allFilmListComponent,
      true,
      'All movies. Upcoming',
    );

    this._renderFilmList(
      this._topRatedFilmListComponent,
      false,
      'Top rated',
    );

    this._renderFilmList(
      this._mostCommentedFilmListComponent,
      false,
      'Most commented',
    );

    this._renderFilmSection();
  }

  _renderFilm(filmContainer, film) {
    const filmPresenter = new FilmPresenter(
      filmContainer,
      this._handleFilmChange,
      this._handlePopupMode,
    );

    filmPresenter.init(film);

    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilmList(filmListComponent, isTitleHidden, titleText) {
    render(
      this._filmSectionComponent,
      filmListComponent,
      RenderPosition.BEFOREEND,
    );

    render(
      filmListComponent,
      new FilmListTitleView(isTitleHidden, titleText),
      RenderPosition.AFTERBEGIN,
    );
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderShowMoreButton() {
    render(
      this._allFilmListComponent,
      this._showMoreButtonComponent,
      RenderPosition.BEFOREEND,
    );

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(
      this._renderedFilmsCount,
      this._renderedFilmsCount + FILM_COUNT_PER_STEP,
    );

    this._renderedFilmsCount += FILM_COUNT_PER_STEP;

    if(this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handlePopupMode() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(
      this._filmSectionContainer,
      new SortView(),
      RenderPosition.BEFOREEND,
    );
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(
        this._allFilmListComponent.getFilmListContainer(),
        film,
      ));
  }

  _renderFilmSection() {
    if(!this._films.length) {
      this._renderFilmList(
        this._emptyFilmListComponent,
        false,
        'There are no movies in our database',
      );

      return;
    }

    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._topRatedFilms.forEach((film) => this._renderFilm(
      this._topRatedFilmListComponent.getFilmListContainer(),
      film,
    ));

    this._mostCommentedFilms.forEach((film) => this._renderFilm(
      this._mostCommentedFilmListComponent.getFilmListContainer(),
      film,
    ));
  }
}
