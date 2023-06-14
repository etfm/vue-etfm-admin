import { IPublicApiGlobal, IPublicTypeEditorGetResult, RegKeyType } from '@etfma/types';
import { IocContext, RegisterOptions } from '../ioc-context';
import { globalSymbol } from './symbols';

export class Global implements IPublicApiGlobal {
  private readonly [globalSymbol]: IocContext;

  constructor(global: IocContext) {
    this[globalSymbol] = global;
  }

  has(keyOrType: KeyType, deep?: boolean | undefined): boolean {
    return this[globalSymbol].has(keyOrType, deep);
  }

  register(data: any, key?: RegKeyType, options?: RegisterOptions | undefined): void {
    return this[globalSymbol].register(data, key, options);
  }
  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
    opt?:
      | {
          forceNew?: boolean | undefined;
          useClassLoader?: boolean | undefined;
          sourceCls?: any;
          sourceType?: KeyOrType | undefined;
        }
      | undefined,
  ): IPublicTypeEditorGetResult<T, KeyOrType> {
    return this[globalSymbol].get(keyOrType, opt);
  }
}
