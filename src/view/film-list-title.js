import AbstractView from './abstract.js';

const createFilmListTitleTemplate = (isHidden, text) => {
  return (
    `<h2 class="films-list__title ${isHidden ? 'visually-hidden' : ''}">${text}</h2>`
  ).trim();
};

export default class FilmListTitle extends AbstractView {
  constructor(isHidden, text) {
    super();
    this._isHidden = isHidden;
    this._text = text;
  }

  getTemplate() {
    return createFilmListTitleTemplate(this._isHidden, this._text);
  }
}
