import { getRandomInteger, getRandomFloat, createText, generateDate } from '../utils/common.js';
import { PEOPLE } from '../const.js';
import { generateComment } from './comment.js';
import { nanoid } from 'nanoid';

const GENRES = [
  'comedy',
  'horror',
  'action',
  'thriller',
  'drama',
];

const COUNTRIES = [
  'USA',
  'England',
  'Japan',
  'South Korea',
];

const TITLES = [
  'Scent of a woman',
  'Heat',
  'Bad boys',
  'Alien',
  'Shawshank redemption',
  'Green mile',
  'American beauty',
  'Goodfellas',
  'The Godfather',
  'Nobody',
  'Toy story',
  'Cocaine',
  'Usual Suspects',
  'Wolf from Wall Street',
  'Donny Brasco',
  'Deadpool',
];

const POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const AGE_RATINGS = [
  '0+',
  '6+',
  '12+',
  '16+',
  '18+',
];

export const generateFilm = () => {
  const alreadyWatched = Boolean(getRandomInteger(0, 1));
  const alreadyWatchedDate = alreadyWatched ? generateDate(-1) : null;

  return {
    id: nanoid(),
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
      isWatchlist: Boolean(getRandomInteger(0, 1)),
      isWatched: alreadyWatched,
      watchingDate: alreadyWatchedDate,
      isFavorite: Boolean(getRandomInteger(0, 1)),
    },
  };
};
