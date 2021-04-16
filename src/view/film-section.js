import AbstractView from './abstract.js';

const createFilmSectionTemplate = () => {
  return (
    `<section class="films">
    </section>`
  ).trim();
};

export default class FilmSection extends AbstractView {
  getTemplate() {
    return createFilmSectionTemplate();
  }
}
