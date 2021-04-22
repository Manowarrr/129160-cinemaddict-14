import dayjs from 'dayjs';
import FilmCardButtonView from './film-card-button.js';
import AbstractView from './abstract.js';

const createFilmCardTemplate = (film) => {
  const { title, totalRating, release, description, runtime, poster } = film.filmInfo;
  const { isWatchlist, isWatched, isFavorite } = film.userDetails;
  const filmDescription = description.split('').slice(0, 140).join('');

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${dayjs(release.date).year()}</span>
        <span class="film-card__duration">1h ${runtime - 60} m</span>
        <span class="film-card__genre">${film.filmInfo.genres[0]}</span>
      </p>
      <img src=${poster} alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${film.comments.length} comments</a>
      <div class="film-card__controls">
        ${new FilmCardButtonView('isWatchlist', isWatchlist).getTemplate()}
        ${new FilmCardButtonView('isWatched', isWatched).getTemplate()}
        ${new FilmCardButtonView('isFavorite', isFavorite).getTemplate()}
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
