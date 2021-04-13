const filmToFilterMap = {
  'All movies': () => '',
  Watchlist: (films) => films.filter((film) => film.userDetails.watchlist).length,
  History: (films) => films.filter((film) => film.userDetails.alreadyWatched).length,
  Favorites: (films) => films.filter((film) => film.userDetails.favorite).length,
};

export const generateFilter = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    let count = countFilms(films) || '0';
    if(filterName === 'All movies') {
      count = '';
    }
    return {
      name: filterName,
      count,
    };
  });
};
