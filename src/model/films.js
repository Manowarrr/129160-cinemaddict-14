import Observer from '../utils/observer.js';
import { sortFilmsByRating } from '../utils/common.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  getFilms() {
    return this._films.slice();
  }

  getTopRatedFilms() {
    return this._films
      .slice()
      .sort(sortFilmsByRating)
      .slice(0, 2);
  }

  getMostCommentedFilms() {
    return this._films
      .slice()
      .sort((a, b) => b.comments.length - a.comments.length)
      .slice(0, 2);
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        filmInfo: {
          title: film.film_info.title,
          actors: film.film_info.actors,
          director: film.film_info.director,
          poster: film.film_info.poster,
          writers: film.film_info.writers,
          runtime: film.film_info.runtime,
          description: film.film_info.description,
          alternativeTitle: film.film_info.alternative_title,
          totalRating: film.film_info.total_rating,
          ageRating: film.film_info.age_rating,
          release: {
            date: film.film_info.release.date,
            country: film.film_info.release.release_country,
          },
          genres: film.film_info.genre,
        },
        userDetails: {
          isWatchlist: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          watchingDate: film.user_details.watching_date,
          isFavorite: film.user_details.favorite,
        },
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;


    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        film_info: {
          title: film.filmInfo.title,
          actors: film.filmInfo.actors,
          director: film.filmInfo.director,
          poster: film.filmInfo.poster,
          writers: film.filmInfo.writers,
          runtime: film.filmInfo.runtime,
          description: film.filmInfo.description,
          alternative_title: film.filmInfo.alternativeTitle,
          total_rating: film.filmInfo.totalRating,
          age_rating: film.filmInfo.ageRating,
          release: {
            date: film.filmInfo.release.date,
            release_country: film.filmInfo.release.country,
          },
          genre: film.filmInfo.genres,
        },
        user_details: {
          watchlist: film.userDetails.isWatchlist,
          already_watched: film.userDetails.isWatched,
          watching_date: film.userDetails.watchingDate,
          favorite: film.userDetails.isFavorite,
        },
      },
    );

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;


    return adaptedFilm;
  }
}

