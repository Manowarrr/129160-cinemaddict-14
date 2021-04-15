import AbstractView from './abstract.js';

const createSiteMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`.trim()
  );
};

export default class SiteMenu extends AbstractView {
  getTemplate() {
    return createSiteMenuTemplate();
  }
}
