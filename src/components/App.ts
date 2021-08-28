import { BaseComponent } from './base-component';
import { CardsField } from './Cards-Field/cards-field';
import { getCollections } from './services';
import { CardInfo } from './types';
import { Router } from './Router';
import { createName } from './utility';
import { Footer } from './Footer/footer';
import { Popup } from './Popup/popup';

const collections = getCollections() as { [key: string]: Array<CardInfo> };

export class App extends BaseComponent {
  cardsField: CardsField;

  constructor() {
    super('div', ['page-container']);
    const main = new BaseComponent('div', ['main']).element;
    const aside = new BaseComponent('aside', []).element;
    const setsList = new BaseComponent('ul').element;
    const closeButton = new BaseComponent('button', ['btn', 'btn_close']).element;
    closeButton.innerHTML = '&times;';

    this.cardsField = new CardsField(main);

    const router = new Router(setsList, this.cardsField);
    router.add('Main Page');
    router.add('Admin', 'admin');
    Object.keys(collections).forEach((set) => {
      router.add(createName(set), set);
    });
    window.location.hash = '';
    window.location.hash = '#main';

    const login = new BaseComponent('form').element;
    const loginButton = new BaseComponent('button', ['btn', 'btn_login'], 'login').element;
    login.append(loginButton);
    aside.append(closeButton);
    aside.append(setsList);
    aside.append(login);

    const header = new BaseComponent('header', ['controls']).element;
    const burgerButton = new BaseComponent('button', ['btn', 'btn_burger']).element;
    burgerButton.innerHTML = '&#9776;';

    burgerButton.addEventListener('click', () => {
      burgerButton.style.visibility = 'hidden';
      aside.classList.add('opened');
    });
    closeButton.addEventListener('click', () => {
      aside.classList.remove('opened');
      burgerButton.setAttribute('style', '');
    });
    this.element.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if ((aside.classList.contains('opened')
      && !target.closest('aside')
      && target !== burgerButton)
      || target.tagName === 'A') {
        aside.classList.remove('opened');
        burgerButton.setAttribute('style', '');
      }
    });
    header.append(burgerButton);
    header.append(this.cardsField.modeSwitch.element);

    main.append(header);
    main.append(this.cardsField.element);

    this.element.append(aside);
    this.element.append(main);
    new Footer().render(this.element);

    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      closeButton.click();
      // if (Boolean(window.localStorage.getItem('token'))) {
      //   router.navigate('#admin');
      // }
      new Popup('login').showPopup();
    });
  }
}
