import { createElement } from '../utils.js';

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  const countString = `<span class="main-navigation__item-count">${count}</span>`;

  return (
    `<a
    href="#watchlist"
    class="main-navigation__item">${name}
    ${count ? countString : ''}
    </a>`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter))
    .join('');
  return (
    `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`
  ).trim();
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
