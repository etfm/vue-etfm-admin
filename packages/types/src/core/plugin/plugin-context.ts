import { Router } from 'vue-router';
import {
  IPublicApiLogger,
  IPublicApiMaterial,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicApiEvent,
  IPublicApiGlobal,
} from '../api';
import { IPublicModelEngineConfig } from '../engine-config';
import { IPluginPreferenceMananger } from './plugin-manager';
import { IPublicTypePluginMeta } from './plugin-meta';

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

export interface IPluginContextPrivate {
  set skeleton(skeleton: IPublicApiSkeleton);
  set event(event: IPublicApiEvent);
  set config(config: IPublicModelEngineConfig);
  set global(global: IPublicApiGlobal);
  set router(router: Router);
  set material(material: IPublicApiMaterial);
  set plugins(plugins: IPublicApiPlugins);
  set logger(plugins: IPublicApiLogger);
}

export interface IPluginContextApiAssembler {
  assembleApis(
    context: IPluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ): void;
}

export type IPublicPluginContext = IPluginContextPrivate & IPublicModelPluginContext;
