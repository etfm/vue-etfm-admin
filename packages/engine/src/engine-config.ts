import { Logger } from '@etfm/shared';
import { Config, IConfig } from './config';
import { IPublicKeyType, IPublicTypeDisposable, IPublicTypeEngineOptions } from '@etfm/types';
import {} from '@etfm/types';
import { lodash } from '@etfm/shared';

const logger = new Logger({ bizName: 'config' });

// used in strict mode, when only options in this VALID_ENGINE_OPTIONS can be accepted
// type and description are only used for developer`s assistance, won`t affect runtime
const VALID_ENGINE_OPTIONS = {
  theme: {
    type: 'object',
    description: '主题配置',
  },
  i18n: {
    type: 'object',
    description: '多语言',
  },
  router: {
    type: 'object',
    description: '路由，继承vue-router所有配置',
  },
  version: {
    type: 'string',
    description: 'Etfm-Engine 版本',
  },
};

export interface IEngineConfig {
  /**
   * 判断指定 key 是否有值
   * check if config has certain key configed
   * @param key
   * @returns
   */
  has(key: any): boolean;

  /**
   * 获取指定 key 的值
   * get value by key
   * @param key
   * @param defaultValue
   * @returns
   */
  get(key: any, defaultValue?: IPublicKeyType): any;

  /**
   * 设置指定 key 的值
   * set value for certain key
   * @param key
   * @param value
   */
  set(key: any, ...value: IPublicKeyType[]): void;

  /**
   * 批量设值，set 的对象版本
   * set multiple config key-values
   * @param config
   */
  setConfig(config: { [key: string]: IPublicKeyType }): void;

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * wait until value of certain key is set, will only be
   * triggered once.
   * @param key
   * @returns
   */
  onceGot(key: any): Promise<any>;

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * set callback for event of value set for some key
   * this will be called each time the value is set
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: any, fn: (data: any) => void): IPublicTypeDisposable;
}

export class EngineConfig implements IEngineConfig {
  private config: IConfig;

  constructor() {
    this.config = new Config();
  }

  /**
   * 判断指定 key 是否有值
   * @param key
   */
  has(key: string): boolean {
    return this.config.has(key);
  }

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   */
  get(key: string, defaultValue?: any): any {
    return this.config.get(key, defaultValue);
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.config.set(key, value);
  }

  /**
   * 批量设值，set 的对象版本
   * @param config
   */
  setConfig(config: { [key: string]: any }) {
    this.config.setConfig(config);
  }

  /**
   * @param {IPublicTypeEngineOptions} engineOptions
   */
  setEngineOptions(engineOptions?: IPublicTypeEngineOptions) {
    if (!engineOptions || !lodash.isPlainObject(engineOptions)) {
      return;
    }
    const isValidKey = (key: string) => {
      const result = (VALID_ENGINE_OPTIONS as any)[key];
      return !(result === undefined || result === null);
    };
    Object.keys(engineOptions).forEach((key) => {
      if (isValidKey(key)) {
        this.set(key, (engineOptions as any)[key]);
      } else {
        logger.warn(
          `failed to config ${key} to engineConfig, only predefined options can be set under strict mode, predefined options: `,
          VALID_ENGINE_OPTIONS,
        );
      }
    });
  }

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: string): Promise<any> {
    return this.config.onceGot(key);
  }

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: string, fn: (data: any) => void): () => void {
    return this.config.onGot(key, fn);
  }
}

export const engineConfig = new EngineConfig();
