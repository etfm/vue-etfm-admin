import store from 'store';
import { Logger } from '@etfma/shared';
import { IPublicModelPreference } from '@etfma/types';

const logger = new Logger({ bizName: 'Preference' });
const STORAGE_KEY_PREFIX = 'ETFM_ENGINE';

/**
 * used to store user preferences, such as pinned status of a pannel.
 * save to local storage.
 */
export default class Preference implements IPublicModelPreference {
  getStorageKey(key: string, module?: string): string {
    const moduleKey = module || '__inner__';
    return `${STORAGE_KEY_PREFIX}_${moduleKey}.${key}`;
  }

  getStoragePrefix(module?: string) {
    const moduleKey = module || '__inner__';
    return `${STORAGE_KEY_PREFIX}_${moduleKey}.`;
  }

  set(key: string, value: any, module?: string): void {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when setting preference', key);
      return;
    }
    const storageKey = this.getStorageKey(key, module);
    logger.debug('storageKey:', storageKey, 'set with value:', value);
    store.set(storageKey, value);
  }

  get(key: string, module: string): any {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when getting from preference', key);
      return;
    }

    const storageKey = this.getStorageKey(key, module);
    const result = store.get(storageKey);
    logger.debug('storageKey:', storageKey, 'get with result:', result);
    return result;
  }

  getAll() {
    const obj: Record<string, any> = {};
    store.each((value, key) => {
      obj[key] = value;
    });

    return obj;
  }

  getModule(moduleKey: string) {
    const obj: Record<string, any> = {};
    store.each((value, key: string) => {
      const isModule = key.startsWith(`${STORAGE_KEY_PREFIX}_${moduleKey}.`);
      if (isModule) {
        obj[key] = value;
      }
    });

    return obj;
  }

  /**
   * check if local storage contain certain key
   *
   * @param {string} key
   * @param {string} module
   */
  contains(key: string, module: string): boolean {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when getting from preference', key);
      return false;
    }
    const storageKey = this.getStorageKey(key, module);
    const result = store.get(storageKey);

    return !(result === undefined || result === null);
  }
}
