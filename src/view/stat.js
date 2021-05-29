import SmartView from './smart.js';
import { getUserRating } from '../utils/user-rating.js';
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

const getWatchedFilmsByPeriod = (films, period) => {
  const watchedFilms = films.filter((elem) => elem.userDetails.isWatched);

  if (period === PERIODS.ALL) {
    return watchedFilms;
  }
  return watchedFilms
    .slice()
    .filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs(), dayjs().subtract(1, period), null, '[]'));
};

const getStatistics = (data) => {
  if(!data.films.length) {
    return {
      statisticsByGenre: {},
      topGenre: '',
      watchingTime: 0,
      userRating: getUserRating([]),
      watchedFilms: [],
    };
  }

  const watchedFilms = getWatchedFilmsByPeriod(data.films, data.period);
  const statisticsByGenre = {};
  let watchingTime = 0;

  watchedFilms.forEach((film) => {
    watchingTime += film.filmInfo.runtime;
    film.filmInfo.genres.forEach((genre) => statisticsByGenre[genre] = statisticsByGenre[genre] + 1 || 1);
  });

  const topGenre = Object.entries(statisticsByGenre)
    .sort((a, b) => b[1] - a[1])[0][0];

  const userRating = getUserRating(data.films);

  return {
    statisticsByGenre,
    topGenre,
    watchingTime,
    userRating,
    watchedFilms,
  };
};

const createStatisticChart = (cxt, statisticsByGenre) => {
  let data;
  let label;

  if (!Object.keys(statisticsByGenre)) {
    data = 0;
    label = '';
  } else {
    data = Object.values(statisticsByGenre);
    label = Object.keys(statisticsByGenre);
  }

  return new Chart(cxt, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: label,
      datasets: [{
        data: data,
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

const createStatTemplate = (data) => {
  const statistics = getStatistics(data);
  dayjs.extend(duration);
  const durationTimeParse = dayjs.duration(statistics.watchingTime, 'minutes');
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${statistics.userRating}</span>
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
          <p class="statistic__item-text">${statistics.watchedFilms.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${durationTimeParse.hours()}<span class="statistic__item-description">h</span>${durationTimeParse.minutes()}<span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${statistics.topGenre}</p>
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
    this._films = films;

    this._data = {
      period: PERIODS.ALL,
      films,
    };

    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._setInnersHandler();

    this._setChart();
  }

  getTemplate() {
    return createStatTemplate(this._data);
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

  restoreHandlers() {
    this._setInnersHandler();
    this._setChart();
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    createStatisticChart(statisticCtx, getStatistics(this._data).statisticsByGenre);
  }
}
