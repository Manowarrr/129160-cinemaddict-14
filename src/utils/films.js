import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

const FILM_CARD_DESCRIPTION_LENGTH = 140;

export const getYearFromDate = (date) => {
  return dayjs(date).year();
};

export const humanizeDuration = (durationTime) => {
  dayjs.extend(duration);

  const durationTimeParse = dayjs.duration(durationTime, 'minutes');

  return `${durationTimeParse.hours()}h ${durationTimeParse.minutes()}m`;
};

export const limitText = (text) => {
  if (text.length <= FILM_CARD_DESCRIPTION_LENGTH) {
    return text;
  }

  return `${text.slice(0, FILM_CARD_DESCRIPTION_LENGTH)}…`;
};

export const humanizeReleaseDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

export const humanizeCommentDate = (date) => {
  dayjs.extend(relativeTime);

  return `${dayjs(date).toNow(true)} ago`;
};
