import dayjs from 'dayjs';
import SmartView from './smart.js';
import FilmCommentView from './comment';

const EMOJI = {
  smile: 'smile',
  sleeping: 'sleeping',
  puke: 'puke',
  angry: 'angry',
};

const createGenresTemplate = (genres) => {
  const genresString = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  return `<td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
          <td class="film-details__cell">
            ${genresString}`;
};

const createFilmStatesButtons = (isWatchlist, isWatched, isFavorite) => {
  return `<input type="checkbox" ${isWatchlist ? 'checked' : ''} class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
         <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

         <input type="checkbox" ${isWatched ? 'checked' : ''} class="film-details__control-input visually-hidden" id="watched" name="watched">
         <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

         <input type="checkbox" ${isFavorite ? 'checked' : ''} class="film-details__control-input visually-hidden" id="favorite" name="favorite">
         <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`;
};

const createEmojiString = (isEmoji, emojiType) => {
  return isEmoji ? `<img src="images/emoji/${emojiType}.png" width="55" height="55" alt="emoji-${emojiType}">` : '';
};

const createCommentTextString = (commentText) => {
  const value = commentText || '';
  return `
    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${value}</textarea>`;
};

const createFilmDetailsCardTemplate = (data) => {
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
  } = data.filmInfo;

  const {isEmoji, emojiType, commentText} = data;

  const { isWatchlist, isWatched, isFavorite, isTwoOrMoreGenres } = data.userDetails;
  const genresString = createGenresTemplate(genres, isTwoOrMoreGenres);

  const filmsStateButtonString = createFilmStatesButtons(isWatchlist, isWatched, isFavorite);

  const commentsString = data.comments.map((comment) => {
    return new FilmCommentView(comment).getTemplate();
  }).join('');

  const emojiString = createEmojiString(isEmoji, emojiType);
  const commentTextString = createCommentTextString(commentText);

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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsString}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${emojiString}
          </div>
          <label class="film-details__comment-label">
            ${commentTextString}
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" data-emoji="smile" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" data-emoji="sleeping" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" data-emoji="puke" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" data-emoji="angry" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`.trim();
};

export default class FilmDetailsCard extends SmartView {
  constructor(film) {
    super();
    this._data = FilmDetailsCard.parseFilmToData(film);
    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._emojiChoiceHandler = this._emojiChoiceHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsCardTemplate(this._data);
  }

  _emojiChoiceHandler(evt) {
    evt.preventDefault();
    const imgClicked = evt.target.closest('img');
    if(!imgClicked) return;

    this.updateData({
      isEmoji: true,
      emojiType: EMOJI[imgClicked.dataset.emoji],
      scrollTop: this.getElement().scrollTop,
    });
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClickHandler(this._callback.click);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);

    this.getElement().scrollTo(0, this._data.scrollTop);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiChoiceHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._clickHandler);
  }

  _watchedClickHandler() {
    this._callback.watchedClick();
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement()
      .querySelector('#watched')
      .addEventListener('click', this._watchedClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
      .querySelector('.film-details__control-label--watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
      .querySelector('.film-details__control-label--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        isEmoji: false,
        emojiType: null,
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);


    return data;
  }

  removeElement() {
    this._element = null;
  }
}
