import { CardsField } from './Cards-Field/cards-field';
import { Admin } from './Admin/Admin';
import { Routes } from './types';

export class Router {
  routes:Routes[] = [];

  root = '#main';

  admin = '#admin';

  cardField: CardsField;

  constructor(private list: HTMLElement, cardField: CardsField) {
    this.cardField = cardField;

    const onHashChange = () => {
      const currentRoute = this.routes.find((e) => e.path === window.location.hash);
      if (currentRoute !== undefined) {
        this.navigate(currentRoute.path);
      }
    };
    window.addEventListener('hashchange', onHashChange);
  }

  add = (name: string, set = 'main'): Router => {
    const navItem = document.createElement('li');
    const link = document.createElement('a');
    const path = `#${set}`;
    link.href = path;
    link.innerHTML = `${name}`;
    navItem.append(link);
    this.list.append(navItem);
    this.routes.push({ path, navItem });
    return this;
  };

  getFragment = (): string => {
    let fragment = '';
    const match = window.location.href.match(/#(.*)$/);
    fragment = match ? match[1] : '';
    return fragment;
  };

  navigate = (path: string = this.root): void => {
    this.routes.forEach((rout) => rout.navItem.classList.remove('active'));
    const currRout = this.routes.find((rout) => rout.path === path);
    if (currRout) currRout.navItem.classList.add('active');
    switch (true) {
      case path === this.root: this.cardField.createCardsMain();
        break;
      case path === this.admin: new Admin().render();
        break;
      default: this.cardField.createCards(this.getFragment());
        break;
    }
  };
}
