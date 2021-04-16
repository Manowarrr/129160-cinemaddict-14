import dayjs from 'dayjs';

export const createText = (maxSentenceCount) => {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'.split('. ');
  return new Array(getRandomInteger(1, maxSentenceCount)).fill().map(() => text[getRandomInteger(0, text.length -  1)]).join('. ');
};

export const generateDate = (yearFrom) => {
  const yearsGap = getRandomInteger(yearFrom, 0);
  return dayjs().add(yearsGap, 'year').toDate();
};

export const getRandomInteger = (minInteger = 0, maxInteger = 1) => {
  const lower = Math.ceil(Math.min(minInteger, maxInteger));
  const upper = Math.floor(Math.max(minInteger, maxInteger));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (minFloat = 0, maxFloat = 1) => {
  const lower = Math.ceil(Math.min(minFloat, maxFloat));
  const upper = Math.floor(Math.max(minFloat, maxFloat));

  return parseFloat((lower + Math.random() * (upper - lower + 1)).toFixed(1));
};
