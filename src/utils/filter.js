import { FilterType } from '../const';

export const filter  = {
  [FilterType.ALL]: (films) => films,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.userDetails.isFavorite),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.userDetails.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.userDetails.isWatched),
};

export const FilterTypeMatchToFilmsControl = {
  [FilterType.WATCHLIST]: 'isWatchlist',
  [FilterType.FAVORITES]: 'isFavorite',
  [FilterType.HISTORY]: 'isWatched',
};
