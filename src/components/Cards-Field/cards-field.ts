import { BaseComponent } from '../base-component';
import { Card } from '../Card/card';
import { CardCategory } from '../Card/cardCategory';
import { ModeSwitch } from '../ModeSwitch/modeSwitch';
import { getCollections } from '../services';
import { CardInfo } from '../types';
import { Game } from '../Game';

const collections = getCollections() as { [key: string]: Array<CardInfo> };

require('./cards-field.scss');

export class CardsField extends BaseComponent {
  cards: Card[] = [];

  mode = 'train';

  set?: string;

  isCategory = true;

  modeSwitch: ModeSwitch;

  playButton: BaseComponent;

  game?: Game;

  root: HTMLElement;

  constructor(root: HTMLElement) {
    super('div', ['cards-field']);
    this.root = root;
    this.modeSwitch = new ModeSwitch((mode: string): void => {
      this.mode = mode;
      this.changeMode();
    });
    this.playButton = new BaseComponent('button', ['btn', 'btn_play'], 'play');
    this.playButton.element.onclick = () => {
      if (this.set) this.game = new Game(this.root, this.element, this.cards, this.set, this.playButton.element);
    };
  }

  createCards(set: string): void {
    this.isCategory = false;
    this.clear(set);
    collections[set].forEach((col: CardInfo) => {
      const card = new Card(this.mode, col, set);
      this.cards.push(card);
      this.element.append(card.element);
    });
    if (this.mode === 'play') this.root.append(this.playButton.element);
    this.game?.clear();
  }

  createCardsMain(): void {
    this.clear();
    this.isCategory = true;
    this.playButton?.element.remove();
    this.getSets().forEach((collectionItem: CardInfo) => {
      this.element.append(new CardCategory(collectionItem.name).element);
    });
    this.game?.clear();
  }

  clear(set = ''): void {
    this.cards = [];
    this.element.innerHTML = '';
    this.set = set;
  }

  getSets = (): Array<CardInfo> => {
    const info: Array<CardInfo> = [];
    Object.keys(collections).forEach((key) => info.push({ name: key }));
    return info;
  };

  changeMode(): void {
    this.cards.forEach((card) => {
      card.state = this.mode;
    });
    if (!this.isCategory) {
      if (this.mode === 'train') {
        this.playButton.element.remove();
        this.game?.clear();
        this.game = undefined;
        this.cards.forEach((card) => card.element.classList.remove('disabled'));
      } else this.root.append(this.playButton.element);
    }
  }
}
