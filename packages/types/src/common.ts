export type ClassType = Function | (new (...args: any[]) => any);
export type KeyType = ClassType | Symbol | string;
export type RegKeyType = KeyType | undefined;

export interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
