import SiteMenuView from './view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import FilmSectionView from './view/film-section.js';
import FilmListView from './view/film-list.js';
import FilmListTitleView from './view/film-list-title.js';
import UserTitleView from './view/user-title.js';
import FooterStatView from './view/footer-stat.js';
import FilmCardView from './view/film-card.js';
import FilmDetailsCardView from './view/film-details.js';
import ShowMoreButtonView from './view/showmore-button.js';
import { generateFilm } from './mock/film.js';
import { generateFilter } from './mock/filter.js';
import { render, RenderPosition } from './utils/render.js';

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteBodyElement = document.querySelector('body');

/* MENU AND FILTERS */
const mainNavigationComponent = new SiteMenuView();

render(
  siteMainElement,
  mainNavigationComponent,
  RenderPosition.BEFOREEND,
);

render(
  mainNavigationComponent,
  new FilterView(filters),
  RenderPosition.AFTERBEGIN,
);

/* SORTING */
render(
  siteMainElement,
  new SortView(),
  RenderPosition.BEFOREEND,
);

/* FILM SECTION */
const filmSectionComponent = new FilmSectionView();

render(
  siteMainElement,
  filmSectionComponent,
  RenderPosition.BEFOREEND,
);

/* ALL FILM LIST */
const allFilmListComponent = new FilmListView();

render(
  filmSectionComponent,
  allFilmListComponent,
  RenderPosition.BEFOREEND,
);

render(
  allFilmListComponent,
  new FilmListTitleView(true, 'All movies. Upcoming').getElement(),
  RenderPosition.AFTERBEGIN,
);

const allFilmContainer = allFilmListComponent.getFilmListContainer();

/* USER TITLE */
render(
  siteHeaderElement,
  new UserTitleView(),
  RenderPosition.BEFOREEND,
);

/* FOOTER STATISTICS */
render(
  siteFooterElement,
  new FooterStatView(films.length),
  RenderPosition.BEFOREEND,
);


/* TOP RATED FILM LIST */
const topRatedFilmListComponent = new FilmListView(true);

render(
  filmSectionComponent,
  topRatedFilmListComponent,
  RenderPosition.BEFOREEND,
);

render(
  topRatedFilmListComponent,
  new FilmListTitleView(false, 'Top rated'),
  RenderPosition.AFTERBEGIN,
);

/* MOST COMMENTED FILM LIST */
const mostCommentedFilmListComponent = new FilmListView(true);

render(
  filmSectionComponent,
  mostCommentedFilmListComponent,
  RenderPosition.BEFOREEND,
);

render(
  mostCommentedFilmListComponent,
  new FilmListTitleView(false, 'Most commented'),
  RenderPosition.AFTERBEGIN,
);

/* FILM CARD/FILM CARD POPUP RENDERING FUNCTION */

const renderFilmCard = (filmContainer, film) => {
  const filmCardComponent = new FilmCardView(film);
  const filmDetailsPopup = new FilmDetailsCardView(film);

  const removeFilmDetailsPopup = () => {
    filmDetailsPopup._element.remove();
    siteBodyElement.classList.remove('hide-overflow');
    filmDetailsPopup._element = null;
  };

  render(
    filmContainer,
    filmCardComponent,
    RenderPosition.BEFOREEND);

  filmCardComponent.setClickHandler(() => {
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        removeFilmDetailsPopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', onEscKeyDown);

    render(
      siteBodyElement,
      filmDetailsPopup,
      RenderPosition.BEFOREEND,
    );

    filmDetailsPopup.setClickHandler(() => {
      removeFilmDetailsPopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });
  });
};

/* ALL FILMS RENDERING */
for(let i = 1; i <= Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilmCard(allFilmContainer, films[i]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const allFilmShowMoreButton = new ShowMoreButtonView();

  render(
    allFilmListComponent,
    allFilmShowMoreButton,
    RenderPosition.BEFOREEND,
  );

  allFilmShowMoreButton.setClickHandler(() => {
    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilmCard(allFilmContainer, film));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if(renderedFilmCount >= films.length) {
      allFilmShowMoreButton.getElement().remove();
      allFilmShowMoreButton.removeElement();
    }
  });
}

/* TOP RATED FILMS RENDERING */

const topRatedFilmContainer = topRatedFilmListComponent.getFilmListContainer();

films.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);

const topRatedFilms = films.slice(0, 2);

topRatedFilms.forEach((film) => renderFilmCard(topRatedFilmContainer, film));

/* MOST COMMENTED FILMS RENDERING */

const mostCommentedFilmContainer = mostCommentedFilmListComponent.getFilmListContainer();

films.sort((a, b) => b.comments.length - a.comments.length);

const mostCommentedFilms = films.slice(0, 2);

mostCommentedFilms.forEach((film) => renderFilmCard(mostCommentedFilmContainer, film));
