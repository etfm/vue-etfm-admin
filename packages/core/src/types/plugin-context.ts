import { IPublicApiSkeleton, IPublicApiEvent } from './api';
import { IPublicApiLogger } from './api/logger';
import { IPublicApiMaterial } from './api/material';
import { IPluginPreferenceMananger, IPublicApiPlugins } from './api/plugins';
import { IPublicModelEngineConfig } from './engine-config';

export interface IPublicModelPluginContext {
  /**
   * 可通过该对象读取插件初始化配置
   * by using this, init options can be accessed from inside plugin
   */
  preference: IPluginPreferenceMananger;

  /**
   * skeleton API
   * @tutorial https://lowcode-engine.cn/site/docs/api/skeleton
   */
  get skeleton(): IPublicApiSkeleton;

  /**
   * config API
   * @tutorial https://lowcode-engine.cn/site/docs/api/config
   */
  get config(): IPublicModelEngineConfig;

  /**
   * material API
   * @tutorial https://lowcode-engine.cn/site/docs/api/material
   */
  get material(): IPublicApiMaterial;

  /**
   * event API
   * this event works globally, can be used between plugins and engine.
   * @tutorial https://lowcode-engine.cn/site/docs/api/event
   */
  get event(): IPublicApiEvent;

  /**
   * plugins API
   * @tutorial https://lowcode-engine.cn/site/docs/api/plugins
   */
  get plugins(): IPublicApiPlugins;

  /**
   * logger API
   * @tutorial https://lowcode-engine.cn/site/docs/api/logger
   */
  get logger(): IPublicApiLogger;

  /**
   * this event works within current plugin, on an emit locally.
   * @tutorial https://lowcode-engine.cn/site/docs/api/event
   */
  get pluginEvent(): IPublicApiEvent;
}

/**
 * @deprecated please use IPublicModelPluginContext instead
 */
export interface ILowCodePluginContext extends IPublicModelPluginContext {}
