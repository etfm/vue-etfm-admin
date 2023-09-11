import { Logger } from '@etfm/shared';
import {
  IPluginManager,
  IPluginRuntime,
  IPublicTypePluginConfig,
  IPublicTypePluginMeta,
  IPublicTypePluginRegisterOptions,
} from '@etfm/types';

export class PluginRuntime implements IPluginRuntime {
  config: IPublicTypePluginConfig;

  logger: Logger;

  private manager: IPluginManager;

  private _inited: boolean;

  private pluginName: string;

  meta: IPublicTypePluginMeta;

  /**
   * 标识插件状态，是否被 disabled
   */
  private _disabled: boolean;

  preset: boolean;

  constructor(
    pluginName: string,
    manager: IPluginManager,
    config: IPublicTypePluginConfig,
    meta: IPublicTypePluginMeta,
    options?: IPublicTypePluginRegisterOptions,
  ) {
    this.manager = manager;
    this.config = config;
    this.pluginName = pluginName;
    this.meta = meta;
    this.logger = new Logger({ bizName: `plugin:${pluginName}` });
    this._inited = false;
    this._disabled = false;
    this.preset = options?.preset ?? false;
  }

  get name() {
    return this.pluginName;
  }

  get dep() {
    if (typeof this.meta.dependencies === 'string') {
      return [this.meta.dependencies];
    }

    return this.meta.dependencies || [];
  }

  get disabled() {
    return this._disabled;
  }

  get inited() {
    return this._inited;
  }

  async init(forceInit?: boolean) {
    if (this._inited && !forceInit) return;
    this.logger.log('method init called');
    await this.config.init?.call(undefined);
    this._inited = true;
  }

  async destroy() {
    if (!this._inited) return;
    this.logger.log('method destroy called');
    await this.config?.destroy?.call(undefined);
    this._inited = false;
  }

  setDisabled(flag = true) {
    this._disabled = flag;
  }

  toProxy() {
    const exports = this.config.exports?.();
    return new Proxy(this, {
      get(target, prop, receiver) {
        if ({}.hasOwnProperty.call(exports, prop)) {
          return exports?.[prop as string];
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  async dispose() {
    await this.manager.delete(this.name);
  }
}
