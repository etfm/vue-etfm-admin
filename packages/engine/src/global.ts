import type { IPublicTypeEditorGetResult, IPublicTypeEditorValueKey } from '@etfm/types';
import { Config, IConfig } from './config';
import { Logger } from '@etfm/shared';

const logger = new Logger({ bizName: 'global' });

export class Global {
  config: IConfig;

  constructor() {
    this.config = new Config();
  }

  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeEditorGetResult<T, KeyOrType> | undefined {
    return this.config.get(keyOrType);
  }

  has(keyOrType: any): boolean {
    return this.config.has(keyOrType);
  }

  set(key: IPublicTypeEditorValueKey, data: any): void | Promise<void> {
    this.config.set(key, data);
  }

  register(data: any, key?: IPublicTypeEditorValueKey): void {
    if (this.has(key)) {
      logger.warn(
        `failed to config ${key || data} to global, 该配置已被注册：${this.config.getConfig()}`,
      );
      return;
    }
    this.set(key || data, data);
  }
}
