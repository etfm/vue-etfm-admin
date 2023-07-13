export * from './router';
export * from './pinia';
export * from './render';
export * from './http';
export * from './tools';
export * from './menu';
export * from './locale';
export * from './element-ui';
export * from './core';
export * from './common';
export * from './install';
export * from './prop';

export const mutable = <T extends readonly any[] | Record<string, unknown>>(val: T) =>
  val as Mutable<typeof val>;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type HTMLElementCustomized<T> = HTMLElement & T;

export type Arrayable<T> = T | T[];
export type Awaitable<T> = Promise<T> | T;
