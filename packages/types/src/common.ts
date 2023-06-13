export type ClassType = Function | (new (...args: any[]) => any);
export type KeyType = ClassType | Symbol | string;
export type RegKeyType = KeyType | undefined;
