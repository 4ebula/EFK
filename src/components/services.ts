import { CardInfo } from './types';

export async function loadCollections(): Promise<string> {
  const response = await fetch('./collections.json');
  const collection = await response.json();
  return JSON.stringify(collection);
}

export async function putCollections(): Promise<void> {
  const storage = window.localStorage;
  const storageCollection = storage.getItem('collections');
  const loadedCollection = await loadCollections();
  if (!storageCollection) {
    storage.setItem('collections', loadedCollection);
  } else if (loadedCollection !== storageCollection) {
    storage.removeItem('collections');
    storage.setItem('collections', loadedCollection);
  }
}

export function getCollections(): { [key: string]: Array<CardInfo> } {
  const { localStorage } = window;
  if (!localStorage.getItem('collections')) putCollections();
  const collection = localStorage.getItem('collections') as string;
  return JSON.parse(collection);
}
