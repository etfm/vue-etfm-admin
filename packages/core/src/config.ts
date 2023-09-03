import { Logger, lodash } from '@etfma/shared';
import Preference from './utils/preference';
import type {
  IPluginTypeConfig,
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
    type: 'string',
    storage: true,
    defaultValue: 'side-nav',
    description:
      '布局方式：side-nav 侧边菜单布局 header-nav 顶部菜单布局 mixed-nav 侧边&顶部菜单布局 side-mixed-nav 侧边混合菜单布局',
  },
  'layout.isFullContent': {
    type: 'boolean',
    storage: true,
    defaultValue: false,
    description: '是否全屏显示content，不需要侧边、底部、顶部、tab区域',
  },
  'layout.zIndex': {
    type: 'number',
    storage: true,
    defaultValue: 1000,
    description: '布局的层级',
  },
  'layout.isMobile': {
    type: 'boolean',
    storage: true,
    defaultValue: false,
    description: '是否移动端显示',
  },
  'layout.headerVisible': {
    type: 'boolean',
    storage: true,
    defaultValue: true,
    description: 'header是否显示',
  },
  'layout.headerHeight': {
    type: 'number',
    storage: true,
    defaultValue: 48,
    description: 'header是否显示',
  },
  'layout.headerFixed': {
    type: 'boolean',
    storage: true,
    defaultValue: true,
    description: 'header是否固定在顶部',
  },
  'layout.headerBackgroundColor': {
    type: 'string',
    storage: true,
    defaultValue: '',
    description: 'header背景颜色',
  },
  'layout.sideVisible': {
    type: 'boolean',
    storage: true,
    defaultValue: true,
    description: '侧边栏是否可见',
  },
  'layout.sideWidth': {
    type: 'number',
    storage: true,
    defaultValue: 180,
    description: '侧边栏宽度',
  },
  'layout.sideMixedWidth': {
    type: 'number',
    storage: true,
    defaultValue: 80,
    description: '混合侧边栏宽度',
  },
  'layout.sideBackgroundColor': {
    type: 'string',
    storage: true,
    defaultValue: '',
    description: '侧边栏背景颜色',
  },
  'layout.sideCollapse': {
    type: 'boolean',
    storage: true,
    defaultValue: false,
    description: '侧边菜单折叠状态',
  },
  'layout.sideCollapseWidth': {
    type: 'number',
    storage: true,
    defaultValue: 48,
    description: '侧边菜单折叠宽度',
  },
  'layout.contentPadding': {
    type: 'number',
    storage: true,
    defaultValue: 0,
    description: 'padding',
  },
  'layout.contentPaddingBottom': {
    type: 'number',
    storage: true,
    defaultValue: 0,
    description: 'paddingBottom',
  },
  'layout.contentPaddingTop': {
    type: 'number',
    storage: true,
    defaultValue: 0,
    description: 'paddingTop',
  },
  'layout.contentPaddingLeft': {
    type: 'number',
    storage: true,
    defaultValue: 0,
    description: 'paddingLeft',
  },
  'layout.contentPaddingRight': {
    type: 'number',
    storage: true,
    defaultValue: 0,
    description: 'paddingRight',
  },
  'layout.contentBackgroundColor': {
    type: 'string',
    storage: true,
    defaultValue: '',
    description: 'content背景颜色',
  },
  'layout.footerVisible': {
    type: 'boolean',
    storage: true,
    defaultValue: false,
    description: 'footer 是否可见',
  },
  'layout.footerHeight': {
    type: 'number',
    storage: true,
    defaultValue: 32,
    description: 'footer 高度',
  },
  'layout.footerFixed': {
    type: 'boolean',
    storage: true,
    defaultValue: true,
    description: 'footer 是否固定',
  },
  'layout.footerBackgroundColor': {
    type: 'string',
    storage: true,
    defaultValue: '',
    description: 'footer背景颜色',
  },
  'layout.tabVisible': {
    type: 'boolean',
    storage: true,
    defaultValue: true,
    description: 'tab是否可见',
  },
  'layout.tabHeight': {
    type: 'number',
    storage: true,
    defaultValue: 30,
    description: 'tab高度',
  },
  'layout.tabBackgroundColor': {
    type: 'string',
    storage: true,
    defaultValue: '',
    description: 'tab背景颜色',
  },
  'layout.mixedExtraVisible': {
    type: 'boolean',
    storage: true,
    defaultValue: false,
    description: '混合侧边扩展区域是否可见',
  },
  'layout.fixedMixedExtra': {
    type: 'boolean',
    storage: true,
    defaultValue: false,
    description: '固定混合侧边菜单',
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
  version: {
    type: 'string',
    storage: true,
    description: 'Etfm-Engine 版本',
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
  has(key: IPluginTypeConfig): boolean {
    return this.config[key] !== undefined;
  }

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   */
  get(key: IPluginTypeConfig, defaultValue?: any): any {
    return lodash.get(this.config, key, defaultValue);
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: IPluginTypeConfig, value: any) {
    // const keys = key.split('.');
    // const result = VALID_ENGINE_OPTIONS[keys[0]];
    // const isValidKey = () => {
    //   return (
    //     !(result === undefined || result === null) &&
    //     (typeof value == null || typeof value == 'undefined' || typeof value === result.type)
    //   );
    // };

    // if (isValidKey()) {
    //   if (cover) {
    //     lodash.set(this.config, key, value);
    //   } else {
    //     const mergeValues = lodash.isPlainObject(value)
    //       ? deepMerge(lodash.get(this.config, key), value)
    //       : value;
    //     lodash.set(this.config, key, mergeValues);
    //   }

    //   result.storage && this.preference.set(STORE_MODULE, this.config, STORE_MODULE);
    //   this.notifyGot(key);
    // } else {
    //   logger.warn(
    //     'failed to config',
    //     key,
    //     `to engineConfig, only predefined options can be set under strict mode, predefined options: `,
    //     VALID_ENGINE_OPTIONS,
    //   );
    // }

    const result = VALID_ENGINE_OPTIONS[key];
    const isValidKey = () => {
      if (result === undefined || result === null) {
        logger.warn(
          'failed to config',
          key,
          `to engineConfig, only predefined options can be set under strict mode, predefined options: `,
          VALID_ENGINE_OPTIONS,
        );
        return false;
      }

      if (typeof value != result.type) {
        logger.warn(
          'failed to config',
          key,
          `to engineConfig, Correct attribute ${
            result.type
          }, actual output ${typeof value}, predefined options: `,
          VALID_ENGINE_OPTIONS,
        );
        return false;
      }
      return true;
    };

    if (isValidKey()) {
      this.config[key] = value;
      result.storage && this.preference.set(key, value, STORE_MODULE);
      this.notifyGot(key);
    }
  }

  setConfig(engineOptions: IPublicTypeEngineOptions) {
    if (!engineOptions || !lodash.isPlainObject(engineOptions)) {
      return;
    }

    Object.keys(engineOptions).forEach((key) => {
      this.set(key as IPluginTypeConfig, (engineOptions as any)[key]);
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
    // return this.preference.get(STORE_MODULE, STORE_MODULE);
  }

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: IPluginTypeConfig): Promise<any> {
    const val = lodash.get(this.config, key);
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
  onGot(key: IPluginTypeConfig, fn: (data: any) => void): () => void {
    const val = lodash.get(this.config, key);
    if (val !== undefined) {
      fn(val);
    }
    this.setWait(key, fn);
    return () => {
      this.delWait(key, fn);
    };
  }

  notifyGot(key: IPluginTypeConfig): void {
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
