import { IPublicTypeEditorGetResult } from '../core';

export declare type RegKeyType = KeyType | undefined;
export interface RegisterOptions {
  /** default: true */
  singleton?: boolean;
  /** if data a class, auto new a instance.
   *  if data a function, auto run(lazy).
   *  default: true */
  autoNew?: boolean;
}

export interface IPublicApiGlobal {
  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
    opt?: {
      /** always get new instance */
      forceNew?: boolean;
      /** use classLoader */
      useClassLoader?: boolean;
      /** source of invoke cls */
      sourceCls?: any;
      /** source of type */
      sourceType?: KeyOrType;
    },
  ): IPublicTypeEditorGetResult<T, KeyOrType>;

  has(keyOrType: KeyType, deep?: boolean): boolean;

  register(data: any, key?: RegKeyType, options?: RegisterOptions): void;
}
