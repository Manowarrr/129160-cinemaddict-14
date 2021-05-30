export const getUserRating = (films) => {
  const watchedFilmsCount = films ? films.slice().filter((film) => film.userDetails.isWatched).length : 0;
  if(watchedFilmsCount === 0) {
    return 'none';
  }

  if(watchedFilmsCount >= 1 && watchedFilmsCount <= 10) {
    return 'novice';
  }

  if(watchedFilmsCount >= 11 && watchedFilmsCount <= 20) {
    return 'fan';
  }

  if(watchedFilmsCount >= 21) {
    return 'movie buff';
  }
};
