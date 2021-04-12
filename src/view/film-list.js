import { createElement } from '../utils.js';

const createFilmListTemplate = (isExtra) => {
  return (
    `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
      <div class="films-list__container">
      </div>
  </section>`
  ).trim();
};

export default class FilmList {
  constructor(isExtra) {
    this._element = null;
    this._isExtra = isExtra;
  }

  getTemplate() {
    return createFilmListTemplate(this._isExtra);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getFilmListContainer() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element.querySelector('.films-list__container');
  }

  removeElement() {
    this._element = null;
  }
}
