import { BaseComponent } from '../base-component';
import { verifyForm } from '../utility';

require('./popup.scss');

export class Popup extends BaseComponent {
  container: HTMLElement;

  constructor(type: string, isWon?: boolean) {
    super('div', ['popup']);
    this.container = new BaseComponent('div', ['popup-container']).element;
    if (document.body) document.body.append(this.container);
    switch (type) {
      case 'endGame': if (isWon !== undefined) this.gamePopup(isWon);
        break;
      case 'login': this.loginPopup();
        break;
      default: break;
    }
  }

  loginPopup(): void {
    const loginForm = new BaseComponent('form', ['login-form']).element;
    const buttonContainer = new BaseComponent('button', ['btn-container']).element;
    const loginHeding = new BaseComponent('h4', [], 'Login').element;
    const loginInput = new BaseComponent('input').element as HTMLInputElement;
    loginInput.name = 'login';
    loginInput.placeholder = 'login';
    const passwordInput = new BaseComponent('input').element as HTMLInputElement;
    passwordInput.name = 'password';
    passwordInput.placeholder = 'password';
    [loginInput, passwordInput].forEach((input) => {
      input.type = 'text';
    });
    const loginButton = new BaseComponent('button', ['btn', 'btn_log'], 'login').element;
    const cancelButton = new BaseComponent('button', ['btn', 'btn_cancel'], 'cancel').element;
    [loginButton, cancelButton].forEach((button) => {
      button.onclick = (event) => event.preventDefault();
      buttonContainer.append(button);
    });
    [loginHeding, loginInput, passwordInput, buttonContainer].forEach((el) => {
      loginForm.append(el);
    });

    loginForm.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target === cancelButton) this.closePopup();
      if (target === loginButton) {
        this.closePopup();
        verifyForm(loginForm as HTMLFormElement);
      }
    });
    this.element.append(loginForm);
  }

  gamePopup(isWon: boolean): void {
    this.element.innerText = isWon ? 'Congratulations! You won!' : 'Sorry, you lost!';
    new Audio(`./audio/${isWon ? 'success' : 'failure'}.mp3`).play();
    const button = new BaseComponent('button', ['btn', 'btn_ok'], 'OK').element;
    const buttonContainer = new BaseComponent('button', ['btn-container']).element;
    this.element.append(buttonContainer);
    buttonContainer.append(button);
    button.onclick = () => this.closePopup();
  }

  showPopup():void {
    this.container.append(this.element);
    if (document.body) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }
  }

  closePopup(): void {
    this.container.remove();
    if (document.body) document.body.removeAttribute('style');
    window.location.hash = '#main';
  }
}
