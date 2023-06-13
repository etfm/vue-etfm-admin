import { IPublicApiLogger } from './api/logger';
import { IPublicTypePluginConfig } from './plugin-config';
import { IPublicTypePluginMeta } from './plugin-meta';

export interface ILowCodePluginRuntimeCore {
  name: string;
  dep: string[];
  disabled: boolean;
  config: IPublicTypePluginConfig;
  logger: IPublicApiLogger;
  meta: IPublicTypePluginMeta;
  init(forceInit?: boolean): void;
  isInited(): boolean;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

interface ILowCodePluginRuntimeExportsAccessor {
  [propName: string]: any;
}

export type ILowCodePluginRuntime = ILowCodePluginRuntimeCore &
  ILowCodePluginRuntimeExportsAccessor;
