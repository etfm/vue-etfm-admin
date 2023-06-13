import type { RegKeyType } from '../../common';
import { IPublicTypeEditorGetResult } from '../core';
import type { RegisterOptions } from 'power-di';

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
