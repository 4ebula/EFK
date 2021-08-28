import Redux, { createStore } from 'redux';
import { BaseComponent } from '../base-component';
import { Action } from '../types';
import {
  getWordsAmount,
  deleteCategory,
  changeCategory,
  createCategory,
} from '../services-admin';

export class CategoryCard extends BaseComponent {
  id?: number;

  changeCategory?: HTMLElement;

  constructor(id?: number) {
    super('div', ['card_admin']);
    if (id) this.id = id;
  }

  async createFullCard(name: string, root: HTMLElement): Promise<void> {
    const wordAmount = await getWordsAmount(name);
    const categryName = new BaseComponent('p', []).element;
    const store = createStore((state: string = name, action: Action) => {
      if (action.type === 'change_name') return action.payload;
      return state;
    });
    store.subscribe(() => {
      categryName.innerText = store.getState();
    });
    store.dispatch({ type: 'change_name', payload: name });
    this.element.innerHTML = `
    <p>Words: <span>${wordAmount}</span></p>
  `;
    this.element.prepend(categryName);
    const buttonContainer = new BaseComponent('div', ['btn-container']).element;
    const deleteButton = new BaseComponent('button', ['btn', 'btn_delete']).element;
    const updateButton = new BaseComponent('button', ['btn', 'btn_update'], 'update').element;
    const addButton = new BaseComponent('button', ['btn', 'btn_add'], 'add word').element;

    updateButton.onclick = () => {
      this.renderChangeCategoryName(store);
    };
    deleteButton.innerHTML = '&times;';
    deleteButton.onclick = () => {
      deleteCategory(this.id as number);
      this.element.remove();
    };
    [updateButton, addButton].forEach((el) => buttonContainer.append(el));
    [buttonContainer, deleteButton].forEach((el) => this.element.append(el));
    root.prepend(this.element);
  }

  createEmptyCard(root: HTMLElement): void {
    this.element.classList.add('card_new');
    this.element.innerHTML = `
    <p>Create new category</p>
    `;
    const button = new BaseComponent('button', ['btn', 'btn_create'], '+').element;
    this.element.append(button);
    button.onclick = () => {
      this.createNewCategory();
    };
    root.append(this.element);
  }

  renderChangeCategoryName(store: Redux.Store<string, Action>): void {
    this.changeCategory = new BaseComponent('div', ['change_window']).element;
    this.changeCategory.innerHTML = `
      <span>New category name</span>
    `;
    const input = document.createElement('input');
    input.type = 'text';
    this.changeCategory.prepend(input);
    const buttonContainer = new BaseComponent('div', ['btn-container']).element;
    const buttonOk = new BaseComponent('button', ['btn', 'btn_ok'], 'ok').element;
    const buttonCancel = new BaseComponent('button', ['btn', 'btn_cancel'], 'cancel').element;
    [buttonOk, buttonCancel].forEach((el) => buttonContainer.append(el));
    buttonCancel.onclick = () => this.deleteChangeCategoryName();
    buttonOk.onclick = () => {
      const { value } = input;
      if (value !== '') {
        store.dispatch({ type: 'change_name', payload: value });
        if (this.id) changeCategory(this.id, value);
      }
      this.deleteChangeCategoryName();
    };
    this.changeCategory.append(buttonContainer);
    this.element.append(this.changeCategory);
  }

  createNewCategory(): void {
    this.changeCategory = new BaseComponent('div', ['change_window']).element;
    this.changeCategory.innerHTML = `
      <span>New category name</span>
    `;
    const input = document.createElement('input');
    input.type = 'text';
    this.changeCategory.prepend(input);
    const buttonContainer = new BaseComponent('div', ['btn-container']).element;
    const buttonOk = new BaseComponent('button', ['btn', 'btn_ok'], 'ok').element;
    const buttonCancel = new BaseComponent('button', ['btn', 'btn_cancel'], 'cancel').element;
    [buttonOk, buttonCancel].forEach((el) => buttonContainer.append(el));
    buttonCancel.onclick = () => this.deleteChangeCategoryName();
    buttonOk.onclick = async () => {
      const { value } = input;
      if (value !== '') {
        const newId = await createCategory(value);
        new CategoryCard(newId).createFullCard(value, this.element.closest('.cards-field-admin') as HTMLDivElement);
      }
      this.deleteChangeCategoryName();
    };
    this.changeCategory.append(buttonContainer);
    this.element.append(this.changeCategory);
  }

  deleteChangeCategoryName(): void {
    this.changeCategory?.remove();
  }
}
