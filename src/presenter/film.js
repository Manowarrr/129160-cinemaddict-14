import FilmCardView from '../view/film-card.js';
import FilmDetailsCardView from '../view/film-details.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';

const siteBodyElement = document.querySelector('body');
const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

export default class Film {
  constructor(filmContainer, changeData, changeMode) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmDetailsCardComponent = null;
    this._mode = Mode.CLOSED;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleFilmDetailsCardClick = this._handleFilmCardClick.bind(this);

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._removeFilmDetailsPopup = this._removeFilmDetailsPopup.bind(this);
  }

  init(film) {
    this._film = film;

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
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          userDetails: {
            isWatched: !this._film.userDetails.isWatched,
            isWatchlist: this._film.userDetails.isWatchlist,
            watchingDate: this._film.userDetails.watchingDate,
            isFavorite: this._film.userDetails.isFavorite,
          },
        },
      ),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
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
    this._changeData(
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

    this._filmDetailsCardComponent = new FilmDetailsCardView(this._film);

    document.addEventListener('keydown', this._escKeyDownHandler);

    this._mode = Mode.OPENED;

    this._filmDetailsCardComponent.setClickHandler(this._removeFilmDetailsPopup);
    this._filmDetailsCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsCardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetailsCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    render(
      siteBodyElement,
      this._filmDetailsCardComponent,
      RenderPosition.BEFOREEND,
    );
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
