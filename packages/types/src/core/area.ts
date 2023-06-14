export interface IArea<C, T> {
  visible: boolean;
  isEmpty(): boolean;
  add(config: T | C): T;
  remove(config: T | string): number;
  setVisible(flag: boolean): void;
  hide(): void;
  show(): void;
  [x: string]: any;
}
