import FilmCardView from '../view/film-card.js';
import FilmDetailsCardView from '../view/film-details.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';
import { deepClone } from '../utils/common.js';
import { UserAction, UpdateType, PopupState, UserInfoControlsType } from '../const.js';
import dayjs from 'dayjs';

const siteBodyElement = document.querySelector('body');
const Mode = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};

export default class Film {
  constructor(filmContainer, changeData, changeMode, filterModel, api) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._filterModel = filterModel;
    this._api = api;

    this._filmCardComponent = null;
    this._filmDetailsCardComponent = null;
    this._updateAfterClose = false;
    this._mode = Mode.CLOSED;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handleFilmCardControlsClick = this._handleFilmCardControlsClick.bind(this);
    this._handleFilmDetailsCardControlsClick = this._handleFilmDetailsCardControlsClick.bind(this);
    this._handleFilmDetailsCardClick = this._handleFilmCardClick.bind(this);

    this._handleAddCommentClick = this._handleAddCommentClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._removeFilmDetailsPopup = this._removeFilmDetailsPopup.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setClickHandler(this._handleFilmCardClick);
    this._filmCardComponent.setControlsClickHandler(this._handleFilmCardControlsClick);

    if(prevFilmComponent === null) {
      render(
        this._filmContainer,
        this._filmCardComponent,
        RenderPosition.BEFOREEND,
      );

      return;
    }

    if (this._filmContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  resetView() {
    if (this._mode !== Mode.CLOSED) {
      this._removeFilmDetailsPopup();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  showError() {
    this._filmCardComponent.showError();
  }

  _formUpdateData(control) {
    const updateData = deepClone(this._film);
    this._updateData = updateData;
    updateData.userDetails[control] = !updateData.userDetails[control];

    if (control === UserInfoControlsType.ISWATCHED) {
      updateData.userDetails[control] ? updateData.userDetails.watchingDate = dayjs() : updateData.userDetails.watchingDate = null;
    }

    return updateData;
  }

  _handleFilmCardControlsClick(control) {
    const data = this._formUpdateData(control);

    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        data,
      ),
    );
  }

  _handleFilmDetailsCardControlsClick(control) {
    this._updateAfterClose = true;
    const data = this._formUpdateData(control);
    this._api.updateFilm(data)
      .then((response) => {
        this._changeData(
          UserAction.UPDATE_COMMENTS,
          UpdateType.PATCH,
          Object.assign(
            {},
            this._film,
            response,
          ),
        );
        this._filmDetailsCardComponent.setState(PopupState.CONTROL, [], '', control, response.userDetails[control]);
      })
      .catch(() => {
        this._filmDetailsCardComponent.setState(PopupState.CONTROLERROR);
      });
  }

  _handleDeleteCommentClick(commentId, updatedFilm) {
    this._filmDetailsCardComponent.setState(PopupState.DISABLEDCOMMENT, [], commentId);
    this._api.deleteComment(commentId)
      .then(() => {
        this._filmDetailsCardComponent.setState(PopupState.DELETE, [], commentId);
        this._changeData(
          UserAction.UPDATE_COMMENTS,
          UpdateType.PATCH,
          Object.assign(
            {},
            updatedFilm,
            {
              comments: updatedFilm.comments.filter((comment) => comment !== commentId),
            },
          ),
        );
      })
      .catch(() => {
        this._filmDetailsCardComponent.setState(PopupState.DELETEERROR);
      });
  }

  _handleAddCommentClick(updatedFilm, comment) {
    this._filmDetailsCardComponent.setState(PopupState.DISABLEDFORM);
    this._api.addComment(updatedFilm, comment)
      .then((result) => {
        this._filmDetailsCardComponent.setState(PopupState.ADD, result.comments);
        this._changeData(
          UserAction.UPDATE_COMMENTS,
          UpdateType.PATCH,
          Object.assign(
            {},
            result.film,
          ),
        );
      })
      .catch(() => {
        this._filmDetailsCardComponent.setState(PopupState.ADDERROR);
      });
  }

  _removeFilmDetailsPopup() {
    remove(this._filmDetailsCardComponent);
    siteBodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.CLOSED;

    if (this._updateAfterClose) {
      this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        this._updateData,
      );
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeFilmDetailsPopup();
    }
  }

  _handleFilmCardClick() {
    if(this._mode === Mode.OPENED) {
      return;
    }

    this._changeMode();

    this._api.getComments(this._film.id)
      .then((comments) => {
        siteBodyElement.classList.add('hide-overflow');
        this._mode = Mode.OPENED;

        this._filmDetailsCardComponent = new FilmDetailsCardView(this._film, comments);

        document.addEventListener('keydown', this._escKeyDownHandler);

        this._filmDetailsCardComponent.setClickHandler(this._removeFilmDetailsPopup);
        this._filmDetailsCardComponent.setControlsClickHandler(this._handleFilmDetailsCardControlsClick);
        this._filmDetailsCardComponent.setAddCommentClickHandler(this._handleAddCommentClick);
        this._filmDetailsCardComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

        render(
          siteBodyElement,
          this._filmDetailsCardComponent,
          RenderPosition.BEFOREEND,
        );
      })
      .catch(() => {
        this.showError();
      });
  }
}
