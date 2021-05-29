import AbstractView from './abstract.js';
import { getYearFromDate, humanizeDuration, limitText } from '../utils/films.js';

const createFilmCardTemplate = (film) => {
  const { title, totalRating, release, description, runtime, poster } = film.filmInfo;
  const { isWatchlist, isWatched, isFavorite } = film.userDetails;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getYearFromDate(release.date)}</span>
        <span class="film-card__duration">${humanizeDuration(runtime)}</span>
        <span class="film-card__genre">${film.filmInfo.genres[0]}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${limitText(description)}</p>
      <a class="film-card__comments">${film.comments.length} comments</a>
      <div class="film-card__controls">
        <button
          class="film-card__controls-item
                button
                film-card__controls-item--add-to-watchlist
                ${isWatchlist ? 'film-card__controls-item--active' : ''}"
          type="button">
          Add to watchlist
        </button>
        <button
          class="film-card__controls-item
                button
                film-card__controls-item--mark-as-watched
                ${isWatched ? 'film-card__controls-item--active' : ''}"
          type="button">
          Mark as watchec
        </button>
        <button
        class="film-card__controls-item
              button
              film-card__controls-item--favorite
              ${isFavorite ? 'film-card__controls-item--active' : ''}"
        type="button">
        Add to favorite
        </button>
      </div>
    </article>`
  ).trim();
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    const filmImage = this.getElement().querySelector('.film-card__poster');
    const filmTitle = this.getElement().querySelector('.film-card__title');
    const filmComments = this.getElement().querySelector('.film-card__comments');

    [filmImage, filmTitle, filmComments].forEach((element) => {
      element.addEventListener('click', this._clickHandler);
    });
  }
}
