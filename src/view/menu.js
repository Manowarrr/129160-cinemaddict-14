const createFilterTemplate = (filter) => {
  return `<a href="#watchlist" class="main-navigation__item">${filter.name} <span class="main-navigation__item-count">${filter.count}</span></a>`;
};

export const createSiteMenuTemplate = (filters) => {
  const filterString = filters.map((filter) => {
    return createFilterTemplate(filter);
  }).reduce((string, filter) => {
    return string + filter;
  }, '');
  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item">All movies</a>
    ${filterString}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>

<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`;
};
