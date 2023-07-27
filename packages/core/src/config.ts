import { Logger, lodash } from '@etfma/shared';
import Preference from './utils/preference';
import type {
  IPublicModelEngineConfig,
  IPublicModelPreference,
  IPublicTypeEngineOptions,
} from '@etfma/types';

const logger = new Logger({ bizName: 'Config' });

// this default behavior will be different later
// const STRICT_PLUGIN_MODE_DEFAULT = true;

// used in strict mode, when only options in this VALID_ENGINE_OPTIONS can be accepted
// type and description are only used for developer`s assistance, won`t affect runtime
const VALID_ENGINE_OPTIONS = {
  i18n: {
    type: 'object',
    storage: true,
    description: '语言',
  },
  theme: {
    type: 'object',
    storage: true,
    description: '主题',
  },
  router: {
    type: 'object',
    storage: false,
    description: '路由， 继承vue-router所有配置',
  },
  ENGINE_VERSION: {
    type: 'string',
    storage: true,
    description: 'Etfm-Admin-Engine 版本',
  },
  // enableStrict: {
  //   type: 'boolean',
  //   storage: false,
  //   default: STRICT_PLUGIN_MODE_DEFAULT,
  //   description:
  //     '开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过自定义配置项',
  // },
};

const STORE_MODULE = 'CONFIG';

// const getStrictModeValue = (
//   engineOptions: IPublicTypeEngineOptions,
//   defaultValue: boolean,
// ): boolean => {
//   if (!engineOptions || !lodash.isPlainObject(engineOptions)) {
//     return defaultValue;
//   }
//   if (
//     engineOptions.enableStrictPluginMode === undefined ||
//     engineOptions.enableStrictPluginMode === null
//   ) {
//     return defaultValue;
//   }
//   return engineOptions.enableStrictPluginMode;
// };

export interface IEngineConfig extends IPublicModelEngineConfig {
  notifyGot(key: string): void;

  setWait(key: string, resolve: (data: any) => void, once?: boolean): void;

  delWait(key: string, fn: any): void;
}

export class EngineConfig implements IEngineConfig {
  private config: { [key: string]: any } = {};

  private waits = new Map<
    string,
    Array<{
      once?: boolean;
      resolve: (data: any) => void;
    }>
  >();

  /**
   * used to store preferences
   *
   */
  readonly preference: IPublicModelPreference;

  constructor(config?: { [key: string]: any }) {
    this.config = config || {};
    this.preference = new Preference();

    const configs = this.preference.getModule(STORE_MODULE);
    const prefix = this.preference.getStoragePrefix(STORE_MODULE);

    for (const key in configs) {
      if (Object.prototype.hasOwnProperty.call(configs, key)) {
        const configKey = key.split(prefix)[1] || '';

        configKey && (this.config[configKey] = configs[key]);
      }
    }
  }

  /**
   * 判断指定 key 是否有值
   * @param key
   */
  has(key: string): boolean {
    return this.config[key] !== undefined;
  }

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   */
  get(key: string, defaultValue?: any): any {
    return lodash.get(this.config, key, defaultValue);
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    // const strictMode = getStrictModeValue({ [key]: value }, STRICT_PLUGIN_MODE_DEFAULT) === true;
    // if (strictMode) {
    const result = VALID_ENGINE_OPTIONS[key];
    const isValidKey = () => {
      return !(result === undefined || result === null);
    };

    if (isValidKey()) {
      this.config[key] = value;
      result.storage && this.preference.set(key, value, STORE_MODULE);
      this.notifyGot(key);
    } else {
      logger.warn(
        `failed to config ${key} to engineConfig, only predefined options can be set under strict mode, predefined options: ${VALID_ENGINE_OPTIONS}`,
      );
    }
    // }
    // else {
    //   this.preference.set(key, value, STORE_MODULE);
    // }
  }

  /**
   * if engineOptions.strictPluginMode === true, only accept propertied predefined in EngineOptions.
   *
   * @param {IPublicTypeEngineOptions} engineOptions
   */
  setConfig(engineOptions: IPublicTypeEngineOptions) {
    if (!engineOptions || !lodash.isPlainObject(engineOptions)) {
      return;
    }
    Object.keys(engineOptions).forEach((key) => {
      this.set(key, (engineOptions as any)[key]);
    });
  }

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: string): Promise<any> {
    const val = this.config[key];
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise((resolve) => {
      this.setWait(key, resolve, true);
    });
  }

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: string, fn: (data: any) => void): () => void {
    const val = this.config?.[key];
    if (val !== undefined) {
      fn(val);
    }
    this.setWait(key, fn);
    return () => {
      this.delWait(key, fn);
    };
  }

  notifyGot(key: string): void {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }

  setWait(key: string, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  delWait(key: string, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }

  getPreference(): IPublicModelPreference {
    return this.preference;
  }
}

export const engineConfig = new EngineConfig();
