export type CardInfo = {
  name: string,
  rus?: string
};

export interface Collection {
  [key: string]: CardInfo[];
}

export type RouterOptions = {
  mode: string,
  root: string,
};

export type Routes = {
  path: string,
  navItem: HTMLLIElement
};

export type Category = {
  id: number,
  words: { name: string, rus: string }[]
};

export type Action = {
  type: string,
  payload: string
};
