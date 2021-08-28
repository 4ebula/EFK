import { BaseComponent } from '../base-component';
import { getCategories, getID } from '../services-admin';
import { CategoryCard } from './Category-Card';

require('./admin.scss');

export class Admin {
  render = (): void => {
    const main = document.querySelector('.main') as HTMLElement;
    main.classList.add('main_admin');
    main.innerHTML = '';
    const header = new BaseComponent('header', ['header__admin']).element;
    const nav = new BaseComponent('nav').element;
    const buttonContainer = new BaseComponent('div', ['btn-container']).element;
    const logoutButton = new BaseComponent('button', ['btn', 'btn_logout'], 'Logout').element;
    const cardsFieldAdmin = new BaseComponent('div', ['cards-field-admin']).element;
    const height = window.innerHeight;
    cardsFieldAdmin.style.height = `${height - 260}px`;
    nav.innerHTML = `
      <ul>
        <li><a href='#admin' class="active">Categories</a></li>
        <li><a>Words</a></li>
      </ul>
    `;

    getCategories()
      .then((res) => {
        res.forEach(async (el) => {
          const id = await getID(el);
          new CategoryCard(id).createFullCard(el, cardsFieldAdmin);
        });
      })
      .then(() => new CategoryCard().createEmptyCard(cardsFieldAdmin));
    logoutButton.onclick = () => window.location.reload();
    nav.append(buttonContainer);
    buttonContainer.append(logoutButton);
    header.append(nav);
    [header, cardsFieldAdmin].forEach((el) => main.append(el));
  };
}
