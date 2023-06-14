export interface WidgetItem {
  name: string;
}

export interface Activeable {
  setActive(flag: boolean): void;
}

export interface IContainer<T extends WidgetItem, G extends WidgetItem = any> {
  [key: string]: any;
  items: T[];
  current: (T & Activeable) | null;
  visible: boolean;
  active: (nameOrItem?: T | string | null) => void;
  unactive: (nameOrItem?: T | string | null) => void;
  unactiveAll: () => void;
  add: (item: T | G) => T;
  get: (name: string) => T | null;
  getAt: (index: number) => T | null;
  has: (name: string) => boolean;
  indexOf: (item: T) => number;
  remove: (item: string | T) => number;
}
