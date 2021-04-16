import AbstractView from './abstract.js';

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
      <a href="#all" class="main-navigation__item">All movies</a>
      ${filterItemsTemplate}
    </div>`
  ).trim();
};

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
