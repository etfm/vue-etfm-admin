export interface IPublicModelPreference {
  /**
   * set value from local storage by module and key
   */
  set(key: string, value: any, module?: string): void;

  /**
   * get value from local storage by module and key
   */
  get(key: string, module: string): any;

  getModule(module: string): any;

  getStoragePrefix(module: string): string;

  getAll(): any;

  /**
   * check if local storage contain certain key
   */
  contains(key: string, module: string): boolean;
}
