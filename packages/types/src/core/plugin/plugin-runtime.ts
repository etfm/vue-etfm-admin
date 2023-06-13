import { IPublicApiLogger } from '../api';
import { IPublicTypePluginConfig } from './plugin-config';
import { IPublicTypePluginMeta } from './plugin-meta';

export interface IPluginRuntimeCore {
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

interface IPluginRuntimeExportsAccessor {
  [propName: string]: any;
}

export type IPluginRuntime = IPluginRuntimeCore & IPluginRuntimeExportsAccessor;
