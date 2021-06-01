import SmartView from './smart.js';
import { getUserRating, getWatchedFilms } from '../utils/user-rating.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const PERIODS = {
  ALL: 'all-time',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const BAR_HEIGHT = 50;

const getWatchedFilmsByPeriod = (films, period) => {
  const watchedFilms = getWatchedFilms(films);

  if (period === PERIODS.ALL) {
    return watchedFilms;
  }
  return watchedFilms
    .filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs(), dayjs().subtract(1, period), null, '[]'));
};

const getTotalDuration = (films) => {
  return films.reduce((accumulator, film) => {
    return accumulator + (film.filmInfo.runtime);
  }, 0);
};

const getGenreStatistics = (films) => {
  const genreStatistics = {};

  films.forEach((film) => {
    film.filmInfo.genres.forEach((genre) => genreStatistics[genre] = genreStatistics[genre] + 1 || 1);
  });

  return genreStatistics;
};

const getTopGenre = (films) => {
  if(films.length === 0) {
    return '';
  }

  const genreStatistics = getGenreStatistics(films);
  const sortGenresByFilmCount = (a, b) => b.filmCount - a.filmCount;

  return Object.entries(genreStatistics).map(([key, value]) => {
    return {
      genre: key,
      filmCount: value,
    };
  }).sort(sortGenresByFilmCount)[0].genre;
};

const createStatisticChart = (cxt, data) => {
  const films = getWatchedFilmsByPeriod(data.films, data.period);

  const statisticsByGenre = getGenreStatistics(films);

  cxt.height = BAR_HEIGHT * Object.keys(statisticsByGenre).length;

  return new Chart(cxt, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: Object.keys(statisticsByGenre),
      datasets: [{
        data: Object.values(statisticsByGenre),
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatTemplate = (data, userRating) => {
  dayjs.extend(duration);

  const films = getWatchedFilmsByPeriod(data.films, data.period);

  const getDuration = () => {
    const watchingTime = getTotalDuration(films);
    if(watchingTime === 0) {
      return 0;
    }

    const durationTimeParse = dayjs.duration(watchingTime, 'minutes');

    return `${durationTimeParse.hours()}
      <span class="statistic__item-description">h</span>
      ${durationTimeParse.minutes()}
      <span class="statistic__item-description">m</span>`;
  };

  return (
    `<section class="statistic">
      <p class="statistic__rank ${userRating === 'none' ? 'visually-hidden' : ''}">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRating}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time">
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="day">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${films.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${getDuration()}</p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${getTopGenre(films)}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`.trim()
  );
};

export default class Stat extends SmartView {
  constructor(films) {
    super();
    this._userRating = getUserRating(films);
    this._data = {
      films,
      period: PERIODS.ALL,
    };

    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._setInnersHandler();

    this._setChart();
  }

  getTemplate() {
    return createStatTemplate(this._data, this._userRating);
  }

  restoreHandlers() {
    this._setInnersHandler();
    this._setChart();
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    createStatisticChart(statisticCtx, this._data);
  }

  _setInnersHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._periodChangeHandler);
    this.getElement().querySelector(`.statistic__filters-input[value=${this._data.period}]`).checked = true;
  }

  _periodChangeHandler(evt) {
    this.updateData({
      period: evt.target.value,
    });
  }
}
