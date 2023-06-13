import { Logger, lodash } from '@etfma/shared';
import Preference from '../utils/preference';
import { IPublicTypeEngineOptions } from '../types/engine-options';
import { IPublicModelEngineConfig } from '../types/engine-config';
import { IPublicModelPreference } from '../types/preference';

const logger = new Logger({ bizName: 'Config' });

// this default behavior will be different later
const STRICT_PLUGIN_MODE_DEFAULT = true;

// used in strict mode, when only options in this VALID_ENGINE_OPTIONS can be accepted
// type and description are only used for developer`s assistance, won`t affect runtime
const VALID_ENGINE_OPTIONS = {
  enableCondition: {
    type: 'boolean',
    description: '是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示',
  },
  designMode: {
    type: 'string',
    enum: ['design', 'live'],
    default: 'design',
    description: '设计模式，live 模式将会实时展示变量值',
  },
  device: {
    type: 'string',
    enum: ['default', 'mobile', 'any string value'],
    default: 'default',
    description: '设备类型',
  },

  locale: {
    type: 'string',
    default: 'zh-CN',
    description: '语言',
  },
  enableStrictPluginMode: {
    type: 'boolean',
    default: STRICT_PLUGIN_MODE_DEFAULT,
    description:
      '开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项',
  },
  supportVariableGlobally: {
    type: 'boolean',
    default: false,
    description: '设置所有属性支持变量配置',
  },
};

const getStrictModeValue = (
  engineOptions: IPublicTypeEngineOptions,
  defaultValue: boolean,
): boolean => {
  if (!engineOptions || !lodash.isPlainObject(engineOptions)) {
    return defaultValue;
  }
  if (
    engineOptions.enableStrictPluginMode === undefined ||
    engineOptions.enableStrictPluginMode === null
  ) {
    return defaultValue;
  }
  return engineOptions.enableStrictPluginMode;
};

export interface IEngineConfig extends IPublicModelEngineConfig {
  /**
   * if engineOptions.strictPluginMode === true, only accept propertied predefined in EngineOptions.
   *
   * @param {IPublicTypeEngineOptions} engineOptions
   */
  setEngineOptions(engineOptions: IPublicTypeEngineOptions): void;

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
    this.config[key] = value;
    this.notifyGot(key);
  }

  /**
   * 批量设值，set 的对象版本
   * @param config
   */
  setConfig(config: { [key: string]: any }) {
    if (config) {
      Object.keys(config).forEach((key) => {
        this.set(key, config[key]);
      });
    }
  }

  /**
   * if engineOptions.strictPluginMode === true, only accept propertied predefined in EngineOptions.
   *
   * @param {IPublicTypeEngineOptions} engineOptions
   */
  setEngineOptions(engineOptions: IPublicTypeEngineOptions) {
    if (!engineOptions || !lodash.isPlainObject(engineOptions)) {
      return;
    }
    const strictMode = getStrictModeValue(engineOptions, STRICT_PLUGIN_MODE_DEFAULT) === true;
    if (strictMode) {
      const isValidKey = (key: string) => {
        const result = (VALID_ENGINE_OPTIONS as any)[key];
        return !(result === undefined || result === null);
      };
      Object.keys(engineOptions).forEach((key) => {
        if (isValidKey(key)) {
          this.set(key, (engineOptions as any)[key]);
        } else {
          logger.warn(
            `failed to config ${key} to engineConfig, only predefined options can be set under strict mode, predefined options: ${VALID_ENGINE_OPTIONS}`,
          );
        }
      });
    } else {
      this.setConfig(engineOptions as any);
    }
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
