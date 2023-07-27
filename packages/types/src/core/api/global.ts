import type { RegKeyType } from '../../common';
import { IPublicTypeEditorGetResult } from '../core';
import type { RegisterOptions } from 'power-di';

export interface IPublicApiGlobal {
  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeEditorGetResult<T, KeyOrType> | undefined;

  set(key: KeyType, data: any): void;

  has(keyOrType: KeyType, deep?: boolean): boolean;

  register(data: any, key?: RegKeyType, options?: RegisterOptions): void;
}
