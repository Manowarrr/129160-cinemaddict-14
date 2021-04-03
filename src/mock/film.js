import dayjs from 'dayjs';
import { getRandomInteger, getRandomFloat, createText, generateDate } from '../utils.js';
import { TITLES, POSTERS, AGE_RATINGS, PEOPLE, GENRES, COUNTRIES } from '../const.js';
import { generateComment } from './comment.js';

let id = 0;

export const generateFilm = () => {
  const alreadyWatched = Boolean(getRandomInteger(0, 1));
  const alreadyWatchedDate = alreadyWatched ? generateDate(-1) : null;

  return {
    id: ++id,
    comments: new Array(getRandomInteger(0, 5)).fill().map(() => generateComment()),
    filmInfo: {
      title: TITLES[getRandomInteger(0, TITLES.length - 1)],
      alternativeTitle: TITLES[getRandomInteger(0, TITLES.length - 1)],
      totalRating: getRandomFloat(0, 10),
      poster: POSTERS[getRandomInteger(0, POSTERS.length - 1)],
      ageRating: AGE_RATINGS[getRandomInteger(0, AGE_RATINGS.length - 1)],
      director: PEOPLE[getRandomInteger(0, PEOPLE.length - 1)],
      writers: new Array(getRandomInteger(1, 3)).fill().map(() => PEOPLE[getRandomInteger(0, PEOPLE.length - 1)]),
      actors:new Array(getRandomInteger(1, 5)).fill().map(() => PEOPLE[getRandomInteger(0, PEOPLE.length - 1)]),
      release: {
        date: generateDate(-50),
        country: COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)],
      },
      runtime: getRandomInteger(65, 119),
      genres: new Array(getRandomInteger(1, 2)).fill().map(() => GENRES[getRandomInteger(0, GENRES.length - 1)]),
      description: createText(15),
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: alreadyWatched,
      watchingDate: alreadyWatchedDate,
      favorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
