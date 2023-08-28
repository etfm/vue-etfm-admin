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
  layout: {
    type: 'object',
    storage: true,
    defaultValue: {
      layout: 'side-nav',
      zIndex: 1000,
      isMobile: false,
      headerVisible: true,
      headerHeight: 48,
      headerFixed: true,
      headerBackgroundColor: '#fff',
      sideVisible: true,
      sideWidth: 180,
      sideMixedWidth: 80,
      sideCollapse: false,
      sideCollapseWidth: 48,
      sideBackgroundColor: '#fff',
      contentPadding: 16,
      contentPaddingBottom: 16,
      contentPaddingTop: 16,
      contentPaddingLeft: 16,
      contentPaddingRight: 16,
      footerBackgroundColor: '#fff',
      footerHeight: 32,
      footerFixed: true,
      footerVisible: false,
      tabVisible: true,
      tabHeight: 30,
      tabBackgroundColor: '#fff',
      mixedExtraVisible: false,
      fixedMixedExtra: false,
    },
    description: '布局',
  },
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
};

const STORE_MODULE = 'CONFIG';

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
    const result = VALID_ENGINE_OPTIONS[key];
    const isValidKey = () => {
      return (
        !(result === undefined || result === null) &&
        (typeof value == null || typeof value == 'undefined' || typeof value === result.type)
      );
    };

    if (isValidKey()) {
      this.config[key] = value;
      result.storage && this.preference.set(key, value, STORE_MODULE);
      this.notifyGot(key);
    } else {
      logger.warn(
        'failed to config',
        key,
        `to engineConfig, only predefined options can be set under strict mode, predefined options: `,
        VALID_ENGINE_OPTIONS,
      );
    }
  }

  setConfig(engineOptions: IPublicTypeEngineOptions) {
    if (!engineOptions || !lodash.isPlainObject(engineOptions)) {
      return;
    }

    Object.keys(engineOptions).forEach((key) => {
      this.set(key, (engineOptions as any)[key]);
    });
  }

  /**
   * if engineOptions.strictPluginMode === true, only accept propertied predefined in EngineOptions.
   *
   * @param {IPublicTypeEngineOptions} engineOptions
   */
  setEngineOptions(engineOptions: IPublicTypeEngineOptions) {
    const moudle = this.getStorageMoudle();
    const defaultMoudle = this.getDefaultMoudle();

    const configs = lodash.merge(defaultMoudle, engineOptions, moudle);

    this.setConfig(configs);
  }

  getDefaultMoudle() {
    const config = {};

    for (const key in VALID_ENGINE_OPTIONS) {
      if (Object.prototype.hasOwnProperty.call(VALID_ENGINE_OPTIONS, key)) {
        config[key] = VALID_ENGINE_OPTIONS[key]?.defaultValue;
      }
    }

    return config;
  }

  getStorageMoudle() {
    const configs = {};
    const moudle = this.preference.getModule(STORE_MODULE);
    for (const key in moudle) {
      if (Object.prototype.hasOwnProperty.call(moudle, key)) {
        const prefix = this.preference.getStoragePrefix(STORE_MODULE);
        const value = key.split(prefix)[1];

        configs[value] = moudle[key];
      }
    }

    return configs;
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
