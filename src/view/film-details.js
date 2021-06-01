import { humanizeDuration, humanizeReleaseDate, humanizeCommentDate } from '../utils/films.js';
import { PopupState, UserInfoControlsType } from '../const.js';
import SmartView from './smart.js';
import he from 'he';

const EMOJI = {
  smile: 'smile',
  sleeping: 'sleeping',
  puke: 'puke',
  angry: 'angry',
};

const enterKeyCode = 13;

const createGenresTemplate = (genres) => {
  const genresString = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  return `<td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
          <td class="film-details__cell">
            ${genresString}`;
};

const createFilmStatesButtons = (isWatchlist, isWatched, isFavorite) => {
  return `<input type="checkbox" ${isWatchlist ? 'checked' : ''} class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
         <label for="watchlist" data-control="${UserInfoControlsType.ISWATCHLIST}" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

         <input type="checkbox" ${isWatched ? 'checked' : ''} class="film-details__control-input visually-hidden" id="watched" name="watched">
         <label for="watched" data-control="${UserInfoControlsType.ISWATCHED}" class="film-details__control-label film-details__control-label--watched">Already watched</label>

         <input type="checkbox" ${isFavorite ? 'checked' : ''} class="film-details__control-input visually-hidden" id="favorite" name="favorite">
         <label for="favorite" data-control="${UserInfoControlsType.ISFAVORITE}" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`;
};

const createEmojiString = (isEmoji, emojiType) => {
  return isEmoji ? `<img src="images/emoji/${emojiType}.png" width="55" height="55" alt="emoji-${emojiType}">` : '';
};

const createNewCommentTextString = (commentText, isFormDisabled) => {
  const value = commentText || '';
  return `
    <textarea ${isFormDisabled ? 'disabled' : ''} class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(value)}</textarea>`;
};

const createFilmCommentsString = (data) => {
  return data.comments.map((element) =>
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${element.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${element.author}</span>
          <span class="film-details__comment-day">${humanizeCommentDate(element.date)}</span>
          <button class="film-details__comment-delete" data-id="${element.id}" ${data.isCommentDisabled ? 'disabled' : ''}>
          ${data.isDelete && (data.deleteId === element.id) ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`).join('');
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

  const {isEmoji, emojiType, commentText, isFormDisabled} = data;

  const { isWatchlist, isWatched, isFavorite } = data;
  const genresString = createGenresTemplate(genres);

  const filmsStateButtonString = createFilmStatesButtons(isWatchlist, isWatched, isFavorite);

  const emojiString = createEmojiString(isEmoji, emojiType);
  const newCommentTextString = createNewCommentTextString(commentText, isFormDisabled);
  const filmCommentsString = createFilmCommentsString(data);

  return `<section class="film-details">
  <form ${isFormDisabled ? 'disabled' : ''} class="film-details__inner" action="" method="get">
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
              <td class="film-details__cell">${humanizeReleaseDate(release.date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${humanizeDuration(runtime)}</td>
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
          ${filmCommentsString}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${emojiString}
          </div>
          <label class="film-details__comment-label">
            ${newCommentTextString}
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
  constructor(film, comments) {
    super();

    this._data = FilmDetailsCard.parseFilmToData(film, comments);
    this._clickHandler = this._clickHandler.bind(this);
    this._controlsClickHandler = this._controlsClickHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._addCommentClickHandler = this._addCommentClickHandler.bind(this);

    this._emojiChoiceHandler = this._emojiChoiceHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsCardTemplate(this._data);
  }

  setAddCommentClickHandler(callback) {
    this._callback.addCommentClick = callback;

    this.getElement()
      .querySelector('.film-details__inner')
      .addEventListener('keydown', this._addCommentClickHandler);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;

    this.getElement()
      .querySelector('.film-details__comments-list')
      .addEventListener('click', this._deleteCommentClickHandler);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._clickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setClickHandler(this._callback.click);
    this.setControlsClickHandler(this._callback.controlsClick);
    this.setAddCommentClickHandler(this._callback.addCommentClick);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);

    this.getElement().scrollTo(0, this._data.scrollTop);
  }

  setState(state, comments, deleteId, control, controlValue) {
    switch (state) {
      case PopupState.DISABLEDFORM:
        this.updateData(
          {
            isFormDisabled: true,
            scrollTop: this.getElement().scrollTop,
          },
        );
        break;
      case PopupState.DISABLEDCOMMENT:
        this.updateData(
          {
            isCommentDisabled: true,
            deleteId: deleteId,
            isDelete: true,
            scrollTop: this.getElement().scrollTop,
          },
        );
        break;
      case PopupState.ADD:
        this._data.comments = comments;
        this.updateData({
          comments: this._data.comments,
          scrollTop: this.getElement().scrollTop,
          isFormDisabled: false,
          commentText: '',
          isEmoji: false,
        });
        break;
      case PopupState.DELETE:
        this._data.comments = this._data.comments.filter((comment) => comment.id !== deleteId);
        this.updateData({
          comments: this._data.comments,
          scrollTop: this.getElement().scrollTop,
          isCommentDisabled: false,
          isDelete: false,
        });
        break;
      case PopupState.ADDERROR:
        this.updateData(
          {
            isFormDisable: false,
          },
        );
        this.showError();
        break;
      case PopupState.DELETEERROR:
        this.updateData(
          {
            isCommentDisable: false,
            isDelete: false,
          },
        );
        this.showError();
        break;
      case PopupState.CONTROL:
        this.updateData({
          [control]: controlValue,
          scrollTop: this.getElement().scrollTop,
        });
        break;
      case PopupState.CONTROLERROR:
        this.showError();
        break;
    }
  }

  setControlsClickHandler(callback) {
    this._callback.controlsClick = callback;
    this.getElement()
      .querySelectorAll('.film-details__control-label')
      .forEach((controls) => controls.addEventListener('click', this._controlsClickHandler));
  }

  _controlsClickHandler(evt) {
    evt.preventDefault();

    this._callback.controlsClick(evt.target.dataset.control);
  }

  _emojiChoiceHandler(evt) {
    const imgClicked = evt.target.closest('img');
    if(!imgClicked) {
      return;
    }

    this.updateData({
      isEmoji: true,
      emojiType: EMOJI[imgClicked.dataset.emoji],
      scrollTop: this.getElement().scrollTop,
    });

    this._textarea = this.getElement().querySelector('.film-details__comment-input');
    this._textarea.focus();
    this._textarea.setSelectionRange(this._textarea.value.length, this._textarea.value.length);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiChoiceHandler);

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();

    const btnClicked = evt.target.closest('button');
    if(!btnClicked) {
      return;
    }

    this._callback.deleteCommentClick(btnClicked.dataset.id, FilmDetailsCard.parseDataToFilm(this._data));
  }

  _addCommentClickHandler(evt) {
    if((evt.ctrlKey || evt.metaKey) && evt.keyCode === enterKeyCode) {
      if(this._data.emojiType && this._textarea.value) {
        const comment = {
          comment: this._textarea.value,
          emotion: this._data.emojiType,
        };

        this._callback.addCommentClick(FilmDetailsCard.parseDataToFilm(this._data), comment);
      }
    }
  }

  _commentInputHandler(evt) {
    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  static parseFilmToData(film, comments) {
    return Object.assign(
      {},
      film,
      {
        comments: comments,
        isEmoji: false,
        emojiType: null,
        isFormDisabled: false,
        isCommentDisabled: false,
        isDelete: false,
        isWatched: film.userDetails.isWatched,
        isWatchlist: film.userDetails.isWatchlist,
        isFavorite: film.userDetails.isFavorite,
      },
    );
  }

  static parseDataToFilm(data) {
    const film = Object.assign(
      {},
      data,
      {
        comments: data.comments.map((comment) => comment.id),
        userDetails: {
          isWatched: data.isWatched,
          isWatchlist: data.isWatchlist,
          isFavorite: data.isFavorite,
          watchingDate: data.userDetails.watchingDate,
        },
      },
    );

    delete film.isEmoji;
    delete film.emojiType;
    delete film.scrollTop;
    delete film.commentText;
    delete film.isFormDisabled;
    delete film.isCommentDisabled;
    delete film.isDelete;
    delete film.deleteId;
    delete film.isWatched;
    delete film.isWatchlist;
    delete film.isFavorite;
    return film;
  }
}
