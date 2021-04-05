import dayjs from 'dayjs';

export const createFilmCardTemplate = (film) => {
  const { title, totalRating, release, description, runtime, poster } = film.filmInfo;
  const { watchlist, alreadyWatched, favorite } = film.userDetails;
  const filmDescription = description.split('').slice(0, 140).join('');

  const toggleActiveClass = (attribute) => {
    return attribute ? 'film-card__controls-item--active' : '';
  };

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${totalRating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(release.date).year()}</span>
    <span class="film-card__duration">1h ${runtime - 60} m</span>
    <span class="film-card__genre">${film.filmInfo.genres[0]}</span>
  </p>
  <img src=${poster} alt="" class="film-card__poster">
  <p class="film-card__description">${filmDescription}</p>
  <a class="film-card__comments">${film.comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${toggleActiveClass(watchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${toggleActiveClass(alreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${toggleActiveClass(favorite)}" type="button">Mark as favorite</button>
  </div>
</article>`.trim();
};
