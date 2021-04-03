import dayjs from 'dayjs';
import { createText, getRandomInteger, generateDate } from '../utils.js';
import { PEOPLE, EMOTIONS } from '../const.js';

let id = 0;

export const generateComment = () => {
  return {
    id: ++id,
    text: createText(1),
    author: PEOPLE[getRandomInteger(0, PEOPLE.length - 1)],
    date: dayjs(generateDate(-1)).format('YYYY/DD/MM HH:mm'),
    emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
  };
};
