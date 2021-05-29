import dayjs from 'dayjs';

export const sortFilmsByDate = (filmA, filmB) => {
  return dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

export const sortFilmsByRating = (filmA, filmB) => {
  return filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};
