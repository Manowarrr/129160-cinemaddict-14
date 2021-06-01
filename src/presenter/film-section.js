import SortView from '../view/sort.js';
import SiteMenuView from '../view/menu.js';
import FooterStatView from '../view/footer-stat.js';
import UserRatingView from '../view/user-rating.js';
import FilterModel from '../model/filter.js';
import FilterPresenter from '../presenter/filter.js';
import FilmSectionView from '../view/film-section.js';
import SiteStatView from '../view/stat.js';
import FilmListView from '../view/film-list.js';
import FilmListTitleView from '../view/film-list-title.js';
import FilmPresenter from './film.js';
import ShowMoreButtonView from '../view/showmore-button.js';
import { filter } from '../utils/filter.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { sortFilmsByDate, sortFilmsByRating } from '../utils/common.js';
import { getUserRating } from '../utils/user-rating.js';
import { SortType, UpdateType, UserAction } from '../const.js';

const FILM_COUNT_PER_STEP = 5;

export default class FilmSection {
  constructor(container, filmsModel, api, header, footer) {
    this._mainContainer = container;
    this._headerContainer = header;
    this._footerContainer = footer;
    this._filmsModel = filmsModel;
    this._filterModel = new FilterModel();
    this._currentSortType = SortType.DEFAULT;

    this._filmSectionComponent = new FilmSectionView();
    this._allFilmListComponent = null;
    this._emptyFilmListComponent = new FilmListView(true);
    this._topRatedFilmListComponent = null;
    this._mostCommentedFilmListComponent = null;
    this._loadingComponent = new FilmListView(true);

    this._menuComponent = new SiteMenuView();
    this._statisticsComponent = null;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._userRatingComponent = new UserRatingView('none');

    this._isLoading = true;
    this._api = api;

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handlePopupMode = this._handlePopupMode.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleMenuStatButtonClick = this._handleMenuStatButtonClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._filterPresenter = new FilterPresenter(
      this._menuComponent,
      this._filterModel,
      this._filmsModel,
    );
    this._filmPresenter = {};
  }

  init() {
    render(
      this._headerContainer,
      this._userRatingComponent,
      RenderPosition.BEFOREEND,
    );

    render(
      this._mainContainer,
      this._menuComponent,
      RenderPosition.BEFOREEND,
    );
    this._menuComponent.setStatButtonClickHandler(this._handleMenuStatButtonClick);

    this._filterPresenter.init();

    render(
      this._mainContainer,
      this._filmSectionComponent,
      RenderPosition.BEFOREEND,
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
      this._api,
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

  _clearFilmSection({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) =>  presenter.destroy());

    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);
    remove(this._allFilmListComponent);
    remove(this._emptyFilmListComponent);
    remove(this._loadingComponent);

    this._renderedFilmsCount = resetRenderedFilmsCount ? FILM_COUNT_PER_STEP : Math.min(filmCount, this._renderedFilmsCount);

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
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .catch(() => {
            this._filmPresenter[update.id].showError();
          });
        break;
      case UserAction.UPDATE_COMMENTS:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _updateRating() {
    const newUserRatingComponent = new UserRatingView(getUserRating(this._filmsModel.getFilms()));

    this._headerContainer.replaceChild(
      newUserRatingComponent.getElement(),
      this._userRatingComponent.getElement(),
    );

    this._userRatingComponent = newUserRatingComponent;
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._handleFilmChange(data);
        this._updateRating();
        break;
      case UpdateType.MINOR:
        this._clearFilmSection();
        this._renderFilmSection();
        this._updateRating();
        break;
      case UpdateType.MAJOR:
        this.showFilmSection();
        if(this._statisticsComponent) {
          this._statisticsComponent.hide();
        }
        this._handlePopupMode();
        this._clearFilmSection({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmSection();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        remove(this._emptyFilmListComponent);
        this._renderFilmSection(this._filmsModel.getFilms());
        this._updateRating();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmSection({resetRenderedFilmsCount: true});
    this._renderFilmSection();
  }

  _handlePopupMode() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleMenuStatButtonClick() {
    this.hideFilmSection();

    this._filterPresenter.removeActiveFilterStyle(this._filterModel.getFilter());

    if (this._statisticsComponent !== null) {
      remove(this._statisticsComponent);
    }

    this._statisticsComponent = new SiteStatView(this._filmsModel.getFilms());

    render(
      this._mainContainer,
      this._statisticsComponent,
      RenderPosition.BEFOREEND,
    );
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

  _renderFilmSection() {
    if (this._isLoading) {
      this._renderFilmList(
        this._loadingComponent,
        false,
        'Loading...',
      );

      return;
    }

    this._renderSort();

    const filmCount = this._getFilms().length;

    render(
      this._footerContainer,
      new FooterStatView(filmCount),
      RenderPosition.BEFOREEND,
    );

    if(filmCount === 0) {
      this._renderFilmList(
        this._emptyFilmListComponent,
        false,
        'There are no movies in our database',
      );

      return;
    }

    this._allFilmListComponent = new FilmListView();
    this._renderFilmList(
      this._allFilmListComponent,
      true,
      'All movies. Upcoming',
    );

    this._renderFilms(this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmsCount)));

    if (filmCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  showFilmSection() {
    this._filmSectionComponent.show();
    this._sortComponent.show();
  }

  hideFilmSection() {
    this._filmSectionComponent.hide();
    this._sortComponent.hide();
  }
}
