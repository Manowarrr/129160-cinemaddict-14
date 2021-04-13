import dayjs from 'dayjs';
import { createElement } from '../utils.js';
import FilmCommentView from './comment';
import { BODY } from '../const.js';

const createGenresTemplate = (genres) => {
  const genresString = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  return `<td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
          <td class="film-details__cell">
            ${genresString}`;
};

const createFilmStatesButtons = (watchlist, alreadyWatched, favorite) => {
  return `<input type="checkbox" ${watchlist ? 'checked' : ''} class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
         <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

         <input type="checkbox" ${alreadyWatched ? 'checked' : ''} class="film-details__control-input visually-hidden" id="watched" name="watched">
         <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

         <input type="checkbox" ${favorite ? 'checked' : ''} class="film-details__control-input visually-hidden" id="favorite" name="favorite">
         <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`;
};

const createFilmDetailsCardTemplate = (film) => {
  const {
    alternativeTitle,
    ageRating,
    title,
    totalRating,
    release,
    description,
    runtime,
    poster,
    director,
    writers,
    actors,
    genres,
  } = film.filmInfo;

  const { watchlist, alreadyWatched, favorite } = film.userDetails;
  const genresString = createGenresTemplate(genres);

  const filmsStateButtonString = createFilmStatesButtons(watchlist, alreadyWatched, favorite);

  const commentsString = film.comments.map((comment) => {
    return new FilmCommentView(comment).getTemplate();
  }).join('');

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src=${poster} alt="">

          <p class="film-details__age">${ageRating}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(release.date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">1h ${runtime - 60}m</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.country}</td>
            </tr>
            <tr class="film-details__row">
              ${genresString}
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${filmsStateButtonString}
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsString}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`.trim();
};

export default class FilmDetailsCard {
  constructor(film) {
    this._element = null;
    this._film = film;
  }

  getTemplate() {
    return createFilmDetailsCardTemplate(this._film);
  }

  getElement() {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  setClosePopupEvent() {
    const removeElement = this.removeElement.bind(this);

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removeElement();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);

    const closePopupButton = this._element.querySelector('.film-details__close-btn');
    closePopupButton.addEventListener('click', () => {
      document.removeEventListener('keydown', onEscKeyDown);
      removeElement();
    });
  }

  removeElement() {
    this._element.remove();
    BODY.classList.remove('hide-overflow');
    this._element = null;
  }
}
