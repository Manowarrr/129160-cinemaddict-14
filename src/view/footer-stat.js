import AbstractView from './abstract.js';

const createFooterStatTemplate = (filmsCount) => {
  return (
    `<section class="footer__statistics">
      <p>${filmsCount} movies inside</p>
    </section>`.trim()
  );
};


export default class FooterStat extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatTemplate(this._filmsCount);
  }
}
