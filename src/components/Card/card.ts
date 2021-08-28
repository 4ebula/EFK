import { BaseComponent } from '../base-component';
import { CardInfo } from '../types';

require('./card.scss');

const FLIP_CLASS = 'flipped';

export class Card extends BaseComponent {
  name: string;

  cardTextEng: BaseComponent;

  currentState = 'train';

  constructor(mode: string, { name, rus }: CardInfo, setPath?: string) {
    super('div', ['card-container']);
    this.name = name;
    const card = new BaseComponent('div', ['card']).element;
    const cardFront = new BaseComponent('div', ['card__front']).element;
    const cardBack = new BaseComponent('div', ['card__back']).element;
    this.cardTextEng = new BaseComponent('div', ['card__text'], name);
    const cardTextRus = new BaseComponent('div', ['card__text'], rus).element;
    const flipButton = new BaseComponent('button', ['btn', 'btn_flip']).element;

    this.cardTextEng.element.append(flipButton);
    cardFront.innerHTML = `<img src="./collections/${setPath}/${this.name}.jpg">`;
    cardFront.append(this.cardTextEng.element);
    cardBack.innerHTML = `<img src="./collections/${setPath}/${this.name}.jpg">`;
    cardBack.append(cardTextRus);
    card.append(cardFront);
    card.append(cardBack);
    this.element.append(card);

    const audio = new Audio(`./audio/${setPath}/${this.name}.mp3`);

    card.onclick = (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('.card__front')
      && !target.classList.contains('btn')
      && this.state === 'train') audio.play();
    };

    this.state = mode;
    flipButton.addEventListener('click', () => {
      this.flipToBack();
      card.onmouseleave = () => this.flipToFront();
    });
  }

  async flipToBack(): Promise<void> {
    return this.flip(true);
  }

  async flipToFront(): Promise<void> {
    return this.flip(false);
  }

  private flip(isFront = false): Promise<void> {
    return new Promise((resolve) => {
      this.element.classList.toggle(FLIP_CLASS, isFront);
      this.element.addEventListener('transitionend', () => resolve(), {
        once: true,
      });
    });
  }

  set state(value: string) {
    this.currentState = value;
    if (this.currentState === 'play') this.cardTextEng.element.style.display = 'none';
    else this.cardTextEng.element.setAttribute('style', '');
  }

  get state(): string {
    return this.currentState;
  }

  blurCard(): void {
    this.element.classList.add('disabled');
  }

  unblurCard(): void {
    this.element.classList.remove('disabled');
  }
}
