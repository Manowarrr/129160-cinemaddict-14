import Observer from '../utils/observer.js';
import { sortFilmsByRating } from '../utils/common.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  getTopRatedFilms() {
    return this._films
      .slice()
      .sort(sortFilmsByRating)
      .slice(0, 2);
  }

  getMostCommentedFilms() {
    return this._films
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  updateComments(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
