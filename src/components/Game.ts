import { CardInfo } from './types';
import { BaseComponent } from './base-component';
import { getCollections } from './services';
import { Card } from './Card/card';
import { Popup } from './Popup/popup';

export class Game {
  currentSound: string | undefined;

  private repeatButton: BaseComponent;

  root: HTMLElement;

  cardField: HTMLElement;

  smilesContainer: HTMLElement;

  smiles: HTMLElement;

  audioSet: Array<string>;

  path: string;

  isWinning = true;

  cards: Card[];

  constructor(root: HTMLElement, cardField: HTMLElement, cards: Card[], set: string, playButton: HTMLElement) {
    const collections = getCollections() as { [key: string]: Array<CardInfo> };
    this.root = root;
    this.repeatButton = new BaseComponent('button', ['btn', 'btn_repeat']);
    this.repeatButton.element.innerHTML = '&#x21bb;';
    this.cardField = cardField;
    this.cards = cards;

    this.smilesContainer = new BaseComponent('div', ['smiles-container']).element;
    this.smiles = new BaseComponent('div', ['smiles']).element;
    this.smilesContainer.append(this.smiles);
    const width = root.offsetWidth;
    this.smilesContainer.style.width = `${Math.floor(width / 60) * 60}px`;
    this.smilesContainer.style.marginLeft = `${width - (Math.floor(width / 60) * 60)}px`;
    root.append(this.smilesContainer);

    this.audioSet = collections[set].map((e: CardInfo) => e.name);
    root.append(this.repeatButton.element);
    playButton.remove();
    this.path = `./audio/${set}/`;
    this.audioHandler();

    cardField.onclick = (event) => this.cardHandler(event);
    this.repeatButton.element.onclick = () => this.audioHandler();
  }

  clear(): void {
    this.cards.forEach((card) => card.unblurCard());
    this.cardField.onclick = null;
    this.repeatButton.element.remove();
    this.smilesContainer.remove();
  }

  audioHandler(): void {
    if (this.currentSound === undefined) {
      this.currentSound = this.audioSet[Math.floor(Math.random() * this.audioSet.length)];
    }
    const audio = new Audio(`${this.path}${this.currentSound}.mp3`);
    audio.play();
  }

  cardHandler(event: Event): void {
    const target = event.target as HTMLElement;
    const card = target.closest('.card-container');
    if (card !== null) {
      const curCard = this.cards.find((e) => e.element === card);
      if (curCard !== undefined
        && !card.classList.contains('disabled')) {
        if (curCard.name === this.currentSound) {
          new Audio('./audio/correct.mp3').play();
          this.smiles.append(new BaseComponent('div', ['smile', 'smile_left']).element);
          curCard.blurCard();
          this.audioSet = this.audioSet.filter((str) => str !== this.currentSound);
          this.currentSound = undefined;

          if (this.audioSet.length === 0) {
            this.cardField.onclick = null;
            new Popup('endGame', this.isWinning).showPopup();
          } else this.audioHandler();
        } else {
          this.smiles.append(new BaseComponent('div', ['smile', 'smile_right']).element);
          new Audio('./audio/error.mp3').play();
          this.isWinning = false;
        }
      }
    }
  }
}
