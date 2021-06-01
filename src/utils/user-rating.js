const USER_STATUS = {
  'none': {
    FROM: 0,
    TO: 0,
  },
  'novice': {
    FROM: 1,
    TO: 10,
  },
  'fan': {
    FROM: 11,
    TO: 20,
  },
  'movie buff': {
    FROM: 21,
    TO: 100,
  },
};

export const getWatchedFilms = (films) => {
  return films.slice().filter((film) => film.userDetails.isWatched);
};

export const getUserRating = (films) => {
  const watchedFilmsCount = films ? getWatchedFilms(films).length : 0;

  for (const key in USER_STATUS) {
    if (USER_STATUS[key].FROM <= watchedFilmsCount && watchedFilmsCount <= USER_STATUS[key].TO) {
      return key;
    }
  }
};
