import AbstractView from './abstract.js';

const createFilterItemTemplate = (filter, currentFilter) => {
  const {name, count, type} = filter;

  return (
    `<a
      href="#${type}"
      data-sorttype="${type}"
      class="main-navigation__item  ${currentFilter === type ? 'main-navigation__item--active' : ''}">
      ${name}
    <span
      class="main-navigation__item-count ${name === 'All movies' ? 'visually-hidden' : ''}">
        ${count}
      </span>
    </a>`
  );
};

const createFilterTemplate = (filterItems, currentFilter) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join('');

  return (
    `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`
  ).trim();
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    const linkClicked = evt.target.closest('a');
    if(!linkClicked) return;
    this._callback.filterTypeChange(evt.target.dataset.sorttype);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter);
  }
}
