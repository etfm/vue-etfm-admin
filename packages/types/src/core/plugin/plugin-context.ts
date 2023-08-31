import {
  IPublicApiLogger,
  IPublicApiMaterial,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicApiEvent,
  IPublicApiGlobal,
  IPublicApiI18n,
  IPublicApiRouter,
  IPublicApiTheme,
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

  get skeleton(): IPublicApiSkeleton;

  get config(): IPublicModelEngineConfig;

  get material(): IPublicApiMaterial;

  get event(): IPublicApiEvent;

  get plugins(): IPublicApiPlugins;

  get logger(): IPublicApiLogger;

  get pluginEvent(): IPublicApiEvent;

  get global(): IPublicApiGlobal;

  get i18n(): IPublicApiI18n;

  get router(): IPublicApiRouter;

  get theme(): IPublicApiTheme;
}

export interface IPluginContextPrivate {
  set skeleton(skeleton: IPublicApiSkeleton);
  set event(event: IPublicApiEvent);
  set config(config: IPublicModelEngineConfig);
  set global(global: IPublicApiGlobal);
  set i18n(i18n: IPublicApiI18n);
  set router(i18n: IPublicApiRouter);
  set theme(i18n: IPublicApiTheme);
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
