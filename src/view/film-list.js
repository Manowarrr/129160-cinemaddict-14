import AbstractView from './abstract.js';

const createFilmListTemplate = (isExtra) => {
  return (
    `<section class="films-list ${isExtra ? 'films-list--extra' : ''}">
      <div class="films-list__container">
      </div>
  </section>`
  ).trim();
};

export default class FilmList extends AbstractView {
  constructor(isExtra) {
    super();
    this._isExtra = isExtra;
  }

  getTemplate() {
    return createFilmListTemplate(this._isExtra);
  }

  getFilmListContainer() {
    return this._element.querySelector('.films-list__container');
  }
}
