import SortView from '../view/sort.js';
import FilmSectionView from '../view/film-section.js';
import FilmListView from '../view/film-list.js';
import FilmListTitleView from '../view/film-list-title.js';
import FilmPresenter from './film.js';
import ShowMoreButtonView from '../view/showmore-button.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import dayjs from 'dayjs';

const FILM_COUNT_PER_STEP = 5;

const FILM_SECTIONS = {
  TOP: 'TOP',
  COMMENTED: 'COMMENTED',
  ALL: 'ALL',
};

const sortFilmsByDate = (filmA, filmB) => {
  return dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

const sortFilmsByRating = (filmA, filmB) => {
  return filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};

const getTopRatedFilms = (films) => {
  return films.sort(sortFilmsByRating)
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
    this._sortComponent = new SortView();

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmPresenter = {
      ALL: {},
      TOP: {},
      COMMENTED: {},
    };

    this._currentSortType = SortType.DEFAULT;
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
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

  _renderFilm(filmContainer, film, filmSection) {
    const filmPresenter = new FilmPresenter(
      filmContainer,
      this._handleFilmChange,
      this._handlePopupMode,
    );

    filmPresenter.init(film);

    switch (filmSection) {
      case FILM_SECTIONS.TOP:
        this._filmPresenter[filmSection][film.id] = filmPresenter;
        break;
      case FILM_SECTIONS.ALL:
        this._filmPresenter[filmSection][film.id] = filmPresenter;
        break;
      case FILM_SECTIONS.COMMENTED:
        this._filmPresenter[filmSection][film.id] = filmPresenter;
        break;
    }
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
      .values(this._filmPresenter.ALL)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter.ALL = {};
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
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);

    if(this._filmPresenter.ALL[updatedFilm.id]) {
      this._filmPresenter.ALL[updatedFilm.id].init(updatedFilm);
    }

    if(this._filmPresenter.TOP[updatedFilm.id]) {
      this._filmPresenter.TOP[updatedFilm.id].init(updatedFilm);
    }

    if(this._filmPresenter.COMMENTED[updatedFilm.id]) {
      this._filmPresenter.COMMENTED[updatedFilm.id].init(updatedFilm);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilms(0, Math.min(this._films.length, FILM_COUNT_PER_STEP));

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handlePopupMode() {
    Object
      .keys(this._filmPresenter)
      .forEach((key) => Object.values(this._filmPresenter[key])
        .forEach((presenter) => presenter.resetView()));
  }

  _renderSort() {
    render(
      this._filmSectionContainer,
      this._sortComponent,
      RenderPosition.BEFOREEND,
    );

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortFilmsByDate);
        break;
      case SortType.RATING:
        this._films.sort(sortFilmsByRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _renderFilms(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(
        this._allFilmListComponent.getFilmListContainer(),
        film,
        'ALL',
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
      'TOP',
    ));

    this._mostCommentedFilms.forEach((film) => this._renderFilm(
      this._mostCommentedFilmListComponent.getFilmListContainer(),
      film,
      'COMMENTED',
    ));

    console.dir(this._filmPresenter);
  }
}
