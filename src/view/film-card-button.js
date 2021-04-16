import AbstractView from './abstract.js';

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

export default class FilmCardButton extends AbstractView {
  constructor(type, isActive) {
    super();
    this._type = type;
    this._isActive = isActive;
  }

  getTemplate() {
    return createfilmCardButtonTemplate(this._type, this._isActive);
  }
}
