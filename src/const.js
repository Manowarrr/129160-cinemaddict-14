export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  UPDATE_COMMENTS: 'UPDATE_COMMENTS',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  ALL: 'all',
  FAVORITES: 'favorites',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
};

export const PopupState = {
  DELETE: 'deletecomment',
  DISABLEDFORM: 'disabledform',
  DISABLEDCOMMENT: 'disabledform',
  DEFAULT: 'default',
  DELETEERROR: 'deleteerror',
  ADDERROR: 'adderror',
  ADD: 'addcomment',
};
