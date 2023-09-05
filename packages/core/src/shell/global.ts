import {
  IPublicApiGlobal,
  IPublicTypeEditorGetResult,
  IPublicTypeEditorValueKey,
} from '@etfm/types';
import { globalSymbol } from './symbols';
import { Editor } from '../editor';

export class Global implements IPublicApiGlobal {
  private readonly [globalSymbol]: Editor;

  constructor(global: Editor) {
    this[globalSymbol] = global;
  }

  has(keyOrType: KeyType): boolean {
    return this[globalSymbol].has(keyOrType);
  }

  register(data: any, key?: IPublicTypeEditorValueKey): void {
    return this[globalSymbol].register(data, key || data);
  }

  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeEditorGetResult<T, KeyOrType> | undefined {
    return this[globalSymbol].get(keyOrType);
  }

  set(key: IPublicTypeEditorValueKey, data: any) {
    return this[globalSymbol].set(key, data);
  }
}
