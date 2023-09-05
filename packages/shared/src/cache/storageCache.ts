import { isNil } from 'lodash-es';
import type { Nullable } from '@etfm/types';

export interface CreateStorageParams {
  prefixKey: string;
  storage: Storage;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
}

/**
 * Cache class
 * Construction parameters can be passed into sessionStorage, localStorage,
 * @class Cache
 * @example
 */
class WebStorage {
  private storage: Storage;
  private prefixKey?: string;
  private timeout;
  /**
   *
   * @param {*} storage
   */
  constructor(prefixKey, storage, timeout) {
    this.storage = storage;
    this.prefixKey = prefixKey;
    this.timeout = timeout;
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase();
  }

  /**
   * Set cache
   * @param {string} key
   * @param {*} value
   * @param {*} expire Expiration time in seconds
   * @memberof Cache
   */
  set(key: string, value: any, expire: number | null = this.timeout) {
    const stringData = JSON.stringify({
      value,
      time: Date.now(),
      expire: !isNil(expire) ? new Date().getTime() + expire * 1000 : null,
    });
    const stringifyValue = stringData;
    this.storage.setItem(this.getKey(key), stringifyValue);
  }

  /**
   * Read cache
   * @param {string} key
   * @param {*} def
   * @memberof Cache
   */
  get(key: string, def: any = null): any {
    const val = this.storage.getItem(this.getKey(key));
    if (!val) return def;

    try {
      const decVal = val;
      const data = JSON.parse(decVal);
      const { value, expire } = data;
      if (isNil(expire) || expire >= new Date().getTime()) {
        return value;
      }
      this.remove(key);
    } catch (e) {
      return def;
    }
  }

  /**
   * Delete cache based on key
   * @param {string} key
   * @memberof Cache
   */
  remove(key: string) {
    this.storage.removeItem(this.getKey(key));
  }

  /**
   * Delete all caches of this instance
   */
  clear(): void {
    this.storage.clear();
  }
}

export const createStorage = ({
  prefixKey = '',
  storage = sessionStorage,
  timeout = null,
}: Partial<CreateStorageParams> = {}) => {
  return new WebStorage(prefixKey, storage, timeout);
};
