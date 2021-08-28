import { Category } from './types';

// const BaseURL = 'http://127.0.0.1:3000';
const BaseURL = 'https://efkserver.herokuapp.com';

export async function getCategories():Promise<string[]> {
  const response = await fetch(`${BaseURL}/categories/`);
  const categories = await response.json();
  return Object.values(categories);
}

async function getCategory(name: string): Promise<Category> {
  const response = await fetch(`${BaseURL}/category/${name}`);
  if (response.status === 404) throw new Error('Category doesn\'t exist');
  const category: Category = await response.json();
  return category;
}

export async function getID(name: string): Promise<number> {
  const category = await getCategory(name);
  return category.id;
}

export async function getWordsAmount(name: string): Promise<number> {
  const category = await getCategory(name);
  return category.words.length;
}

export async function deleteCategory(id: number): Promise<void> {
  fetch(`${BaseURL}/category/${id}`, {
    method: 'DELETE',
  });
}

export async function createCategory(newName: string): Promise<number> {
  const response = await fetch(`${BaseURL}/category`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ newName }),
  });
  const newId = await response.json();
  return newId.newId as number;
}

export async function changeCategory(id: number, newName: string): Promise<void> {
  fetch(`${BaseURL}/category/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ newName }),
  });
}
