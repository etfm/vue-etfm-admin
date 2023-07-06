export interface IPublicApiLocale {
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
