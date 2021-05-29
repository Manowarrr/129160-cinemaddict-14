import FilmCardView from '../view/film-card.js';
import FilmDetailsCardView from '../view/film-details.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';
import { UserAction, UpdateType, FilterType, PopupState } from '../const.js';
import dayjs from 'dayjs';

const siteBodyElement = document.querySelector('body');
const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

export default class Film {
  constructor(filmContainer, changeData, changeMode, filterModel, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterModel = filterModel;
    this._api = api;

    this._filmCardComponent = null;
    this._filmDetailsCardComponent = null;
    this._mode = Mode.CLOSED;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleFilmDetailsCardClick = this._handleFilmCardClick.bind(this);

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddCommentClick = this._handleAddCommentClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._removeFilmDetailsPopup = this._removeFilmDetailsPopup.bind(this);
  }

  init(film) {
    this._film = film;
    this._comments = null;

    const prevFilmComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if(prevFilmComponent === null) {
      render(
        this._filmContainer,
        this._filmCardComponent,
        RenderPosition.BEFOREEND,
      );

      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  _handleWatchedClick() {
    const updateType = this._filterModel.getFilter() === FilterType.HISTORY ? UpdateType.MINOR : UpdateType.PATCH;
    this._changeData(
      UserAction.UPDATE_FILM,
      updateType,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            isWatched: !this._film.userDetails.isWatched,
            isWatchlist: this._film.userDetails.isWatchlist,
            watchingDate: dayjs(),
            isFavorite: this._film.userDetails.isFavorite,
          },
        },
      ),
    );
  }

  _handleWatchlistClick() {
    const updateType = this._filterModel.getFilter() === FilterType.WATCHLIST ? UpdateType.MINOR : UpdateType.PATCH;
    this._changeData(
      UserAction.UPDATE_FILM,
      updateType,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            isWatchlist: !this._film.userDetails.isWatchlist,
            watchingDate: this._film.userDetails.watchingDate,
            isFavorite: this._film.userDetails.isFavorite,
            isWatched: this._film.userDetails.isWatched,
          },
        },
      ),
    );
  }

  _handleFavoriteClick() {
    const updateType = this._filterModel.getFilter() === FilterType.FAVORITES ? UpdateType.MINOR : UpdateType.PATCH;
    this._changeData(
      UserAction.UPDATE_FILM,
      updateType,
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            isFavorite: !this._film.userDetails.isFavorite,
            isWatched: this._film.userDetails.isWatched,
            isWatchlist: this._film.userDetails.isWatchlist,
            watchingDate: this._film.userDetails.watchingDate,
          },
        },
      ),
    );
  }

  _handleDeleteCommentClick(commentId, updatedFilm) {
    this._filmDetailsCardComponent.setState(PopupState.DISABLEDCOMMENT);
    this._api.deleteComment(commentId)
      .then(() => {
        this._filmDetailsCardComponent.setState(PopupState.DELETE, [], commentId);
        this._changeData(
          UserAction.UPDATE_COMMENTS,
          UpdateType.MINOR,
          Object.assign(
            {},
            updatedFilm,
          ),
        );
      })
      .catch(() => {
        this._filmDetailsCardComponent.setState(PopupState.DELETEERROR);
      });
  }

  _handleAddCommentClick(updatedFilm, comment) {
    this._filmDetailsCardComponent.setState(PopupState.DISABLEDFORM);
    this._api.addComment(updatedFilm, comment)
      .then((result) => {
        this._comments = result.comments;
        this._filmDetailsCardComponent.setState(PopupState.ADD, this._comments);
        this._changeData(
          UserAction.UPDATE_COMMENTS,
          UpdateType.MINOR,
          Object.assign(
            {},
            result.film,
          ),
        );
      })
      .catch(() => {
        this._filmDetailsCardComponent.setState(PopupState.ADDERROR);
      });
  }

  _removeFilmDetailsPopup() {
    remove(this._filmDetailsCardComponent);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.CLOSED;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmDetailsPopup();
    }
  }

  _handleFilmCardClick() {
    this._changeMode();

    this._api.getComments(this._film.id)
      .then((comments) => {
        this._comments = comments;
        this._filmDetailsCardComponent = new FilmDetailsCardView(this._film, this._comments);

        document.addEventListener('keydown', this._escKeyDownHandler);

        this._mode = Mode.OPENED;

        this._filmDetailsCardComponent.setClickHandler(this._removeFilmDetailsPopup);
        this._filmDetailsCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
        this._filmDetailsCardComponent.setWatchedClickHandler(this._handleWatchedClick);
        this._filmDetailsCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
        this._filmDetailsCardComponent.setAddCommentClickHandler(this._handleAddCommentClick);
        this._filmDetailsCardComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

        render(
          siteBodyElement,
          this._filmDetailsCardComponent,
          RenderPosition.BEFOREEND,
        );
      });
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._removeFilmDetailsPopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }
}
