const filmToFilterMap = {
  Watchlist: (films) => films.filter((film) => film.userDetails.isWatchlist).length,
  History: (films) => films.filter((film) => film.userDetails.isWatched).length,
  Favorites: (films) => films.filter((film) => film.userDetails.isFavorite).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films) || '0',
    };
  });
};
