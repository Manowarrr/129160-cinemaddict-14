import AbstractView from './abstract';

const createUserTitleTemplate = (userRating) => {
  return (
    `<section class="header__profile profile ${userRating === 'none' ? 'visually-hidden' : ''}">
      <p class="profile__rating">${userRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  ).trim();
};

export default class UserTitle extends AbstractView{
  constructor(userRating) {
    super();

    this._userRating = userRating;
  }

  getTemplate() {
    return createUserTitleTemplate(this._userRating);
  }
}
