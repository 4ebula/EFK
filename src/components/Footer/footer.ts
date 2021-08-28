import { BaseComponent } from '../base-component';

require('./footer.scss');

export class Footer extends BaseComponent {
  constructor() {
    super('footer');
  }

  render(root: HTMLElement): void {
    this.element.innerHTML = `
    <span>2021</span>
    <div class="github"><span>4ebula</span><a href="https://github.com/4ebula/"></a></div>
    <div class="rs-logo"><a href="https://rs.school/"></a></div>
    `;
    root.append(this.element);
  }
}
