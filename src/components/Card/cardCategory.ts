import { BaseComponent } from '../base-component';
import { createName } from '../utility';

require('./card.scss');

export class CardCategory extends BaseComponent {
  constructor(name: string) {
    super('div', ['card-container']);
    this.element.innerHTML = `
    <div class="card card_category">
      <img src="./collections/sets/${name}.jpg">
      <span class="card__text">${createName(name)}</span>
    </div>
    `;
    this.element.onclick = () => {
      window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${name}`;
    };
  }
}
