import { createElement } from '../utils.js';

const createfilmCardButtonTemplate = (type, isActive) => {
  const BUTTON_TYPES = {
    watchlist: 'add-to-watchlist',
    alreadyWatched: 'mark-as-watched',
    favorite: 'favorite',
  };

  return (
    `<button
      class="film-card__controls-item
             button
             film-card__controls-item--${BUTTON_TYPES[type]}
             ${isActive ? 'film-card__controls-item--active' : ''}"
      type="button">
      Add to watchlist
    </button>`
  );
};

export default class FilmCardButton {
  constructor(type, isActive) {
    this._element = null;
    this._type = type;
    this._isActive = isActive;
  }

  getTemplate() {
    return createfilmCardButtonTemplate(this._type, this._isActive);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
