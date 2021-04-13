import dayjs from 'dayjs';
import { createElement, renderElement, RenderPosition } from '../utils.js';
import FilmCardButtonView from './film-card-button.js';
import FilmDetailsCardView from './film-details.js';
import { BODY } from '../const.js';

const createFilmCardTemplate = (film) => {
  const { title, totalRating, release, description, runtime, poster } = film.filmInfo;
  const { watchlist, alreadyWatched, favorite } = film.userDetails;
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
        ${new FilmCardButtonView('watchlist', watchlist).getTemplate()}
        ${new FilmCardButtonView('alreadyWatched', alreadyWatched).getTemplate()}
        ${new FilmCardButtonView('favorite', favorite).getTemplate()}
      </div>
    </article>`
  ).trim();
};

export default class FilmCard {
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  setOpenPopupEvent() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    const filmImage = this._element.querySelector('.film-card__poster');
    const filmTitle = this._element.querySelector('.film-card__title');
    const filmComments = this._element.querySelector('.film-card__comments');

    [filmImage, filmTitle, filmComments].forEach((element) => {
      element.addEventListener('click', () => {
        const filmDetailsPopup = new FilmDetailsCardView(this._film);
        BODY.classList.add('hide-overflow');

        renderElement(
          BODY,
          filmDetailsPopup.getElement(),
          RenderPosition.BEFOREEND,
        );

        filmDetailsPopup.setClosePopupEvent();
      });
    });
  }

  removeElement() {
    this._element = null;
  }
}
