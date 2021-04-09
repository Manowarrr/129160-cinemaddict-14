import { createElement } from '../utils.js';

const createFooterStatTemplate = (filmsCount) => {
  return (
    `<section class="footer__statistics">
      <p>${filmsCount} movies inside</p>
    </section>`.trim()
  );
};


export default class FooterStat {
  constructor(filmsCount) {
    this._element = null;
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatTemplate(this._filmsCount);
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
