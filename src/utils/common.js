import dayjs from 'dayjs';

export const sortFilmsByDate = (filmA, filmB) => {
  return dayjs(filmB.filmInfo.release.date).diff(dayjs(filmA.filmInfo.release.date));
};

export const sortFilmsByRating = (filmA, filmB) => {
  return filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
};

export const isObject = (obj) => {
  return obj !== null && obj.constructor.name === 'Object';
};

export const deepClone = (obj) => {
  const cloneObject = {};
  for (const i in obj) {
    if (isObject(obj[i])) {
      cloneObject[i] = deepClone(obj[i]);
      continue;
    }
    cloneObject[i] = obj[i];
  }

  return cloneObject;
};
