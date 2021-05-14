import dayjs from 'dayjs';
import { createText, getRandomInteger, generateDate } from '../utils/common.js';
import { PEOPLE } from '../const.js';
import { nanoid } from 'nanoid';

const EMOTIONS = [
  './images/emoji/smile.png',
  './images/emoji/sleeping.png',
  './images/emoji/puke.png',
  './images/emoji/angry.png',
];

export const generateComment = () => {
  return {
    id: nanoid(),
    text: createText(1),
    author: PEOPLE[getRandomInteger(0, PEOPLE.length - 1)],
    date: dayjs(generateDate(-1)).format('YYYY/DD/MM HH:mm'),
    emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
  };
};
