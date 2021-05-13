import SortView from '../view/sort.js';
import FilmSectionView from '../view/film-section.js';
import FilmListView from '../view/film-list.js';
import FilmListTitleView from '../view/film-list-title.js';
import FilmPresenter from './film.js';
import ShowMoreButtonView from '../view/showmore-button.js';
import { filter } from '../utils/filter.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/common.js';
import { SortType, UpdateType, UserAction } from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmSection {
  constructor(container, filmsModel, filterModel) {
    this._mainContainer = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._currentSortType = SortType.DEFAULT;

    this._filmSectionComponent = new FilmSectionView();
    this._allFilmListComponent = new FilmListView();
    this._emptyFilmListComponent = new FilmListView(true);
    this._topRatedFilmListComponent = new FilmListView(true);
    this._mostCommentedFilmListComponent = new FilmListView(true);

    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._filmPresenter = {};
  }

  init() {
    render(
      this._mainContainer,
      this._filmSectionComponent,
      RenderPosition.BEFOREEND,
    );

    const filmCount = this._getFilms().length;

    if(filmCount === 0) {
      this._renderFilmList(
        this._emptyFilmListComponent,
        false,
        'There are no movies in our database',
      );

      return;
    }

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

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortFilmsByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortFilmsByRating);
    }

    return filteredFilms;
  }

  _renderFilm(filmContainer, film) {
    const filmPresenter = new FilmPresenter(
      filmContainer,
      this._handleViewAction,
      this._handlePopupMode,
      this._filterModel,
    );

    filmPresenter.init(film);

    if(this._filmPresenter[film.id]) {
      this._filmPresenter[film.id].push(filmPresenter);
    } else {
      this._filmPresenter[film.id] = [];
      this._filmPresenter[film.id].push(filmPresenter);
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

  _clearFilmSection({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenters) => presenters
        .forEach((presenter) => presenter.destroy()));

    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(
      this._allFilmListComponent,
      this._showMoreButtonComponent,
      RenderPosition.BEFOREEND,
    );
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if(this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilmChange(updatedFilm) {
    this._filmPresenter[updatedFilm.id]
      .forEach((filmPresenter) => filmPresenter.init(updatedFilm));
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.UPDATE_COMMENTS:
        this._filmsModel.updateComments(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._handleFilmChange(data);
        break;
      case UpdateType.MINOR:
        this._clearFilmSection();
        this._renderFilmSection();
        break;
      case UpdateType.MAJOR:
        this._clearFilmSection({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmSection();
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmSection();
    this._renderFilmSection();
  }

  _handlePopupMode() {
    Object
      .values(this._filmPresenter)
      .forEach((presenters) => presenters
        .forEach((presenter) => presenter.resetView()));
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(
      this._mainContainer,
      this._sortComponent,
      RenderPosition.BEFORE,
      this._filmSectionComponent,
    );
  }

  _renderFilms(films) {
    films
      .forEach((film) => this._renderFilm(
        this._allFilmListComponent.getFilmListContainer(),
        film,
      ));
  }

  _renderAdditionalFilmLists() {
    this._filmsModel.getTopRatedFilms().forEach((film) => this._renderFilm(
      this._topRatedFilmListComponent.getFilmListContainer(),
      film,
    ));

    this._filmsModel.getMostCommentedFilms().forEach((film) => this._renderFilm(
      this._mostCommentedFilmListComponent.getFilmListContainer(),
      film,
    ));
  }

  _renderFilmSection() {
    const filmCount = this._getFilms().length;
    this._renderSort();

    this._renderFilms(this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmsCount)));

    if (filmCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }

    this._renderAdditionalFilmLists();
  }
}
