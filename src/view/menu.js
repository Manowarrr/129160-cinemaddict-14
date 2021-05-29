import AbstractView from './abstract.js';

const createSiteMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`.trim()
  );
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._statButtonClickHandler = this._statButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _statButtonClickHandler(evt) {
    evt.preventDefault();
    this.getElement()
      .querySelector('.main-navigation__additional')
      .classList.add('main-navigation__item--active');
    this._callback.statButtonClick();
  }

  setStatButtonClickHandler(callback) {
    this._callback.statButtonClick = callback;
    this.getElement()
      .querySelector('.main-navigation__additional')
      .addEventListener('click', this._statButtonClickHandler);
  }
}
