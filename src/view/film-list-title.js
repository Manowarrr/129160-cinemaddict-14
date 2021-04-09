import { createElement } from '../utils.js';

const createFilmListTitleTemplate = (isHidden, text) => {
  return (
    `<h2 class="films-list__title ${isHidden ? 'visually-hidden' : ''}">${text}</h2>`
  ).trim();
};

export default class FilmListTitle {
  constructor(isHidden, text) {
    this._element = null;
    this._isHidden = isHidden;
    this._text = text;
  }

  getTemplate() {
    return createFilmListTitleTemplate(this._isHidden, this._text);
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
