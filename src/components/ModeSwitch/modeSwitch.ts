import { BaseComponent } from '../base-component';

require('./modeSwitch.scss');

export class ModeSwitch extends BaseComponent {
  mode = 'train';

  constructor(setMode: (mode: string) => void) {
    super('label', ['switch']);
    this.element.innerHTML = '<span class="circle"></span>';
    const setmodeText = new BaseComponent('span', ['switch_text'], 'play').element;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    this.element.prepend(checkbox);
    this.element.append(setmodeText);
    checkbox.addEventListener('change', () => {
      this.mode = checkbox.checked ? 'play' : 'train';
      setmodeText.innerText = '';
      setmodeText.innerText = checkbox.checked ? 'train' : 'play';
      this.element.classList.toggle('play');
      setMode(this.mode);
    });
  }
}
