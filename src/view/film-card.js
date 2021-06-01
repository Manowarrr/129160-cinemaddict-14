import AbstractView from './abstract.js';
import { getYearFromDate, humanizeDuration, limitText } from '../utils/films.js';
import { UserInfoControlsType } from '../const.js';

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
          type="button" data-control="${UserInfoControlsType.ISWATCHLIST}">
          Add to watchlist
        </button>
        <button
          class="film-card__controls-item
                button
                film-card__controls-item--mark-as-watched
                ${isWatched ? 'film-card__controls-item--active' : ''}"
          type="button" data-control="${UserInfoControlsType.ISWATCHED}">
          Mark as watchec
        </button>
        <button
        class="film-card__controls-item
              button
              film-card__controls-item--favorite
              ${isFavorite ? 'film-card__controls-item--active' : ''}"
        type="button" data-control="${UserInfoControlsType.ISFAVORITE}">
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
    this._controlsClickHandler = this._controlsClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _controlsClickHandler(evt) {
    evt.preventDefault();
    this._callback.controlsClick(evt.target.dataset.control);
  }

  setControlsClickHandler(callback) {
    this._callback.controlsClick = callback;
    this.getElement()
      .querySelectorAll('.film-card__controls-item')
      .forEach((controls) => controls.addEventListener('click', this._controlsClickHandler));
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
