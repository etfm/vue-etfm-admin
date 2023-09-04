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
  inited: boolean;
  preset: boolean;
  init(forceInit?: boolean): void;
  destroy(): void;
  dispose(): void;
  toProxy(): any;
  setDisabled(flag?: boolean): void;
}

interface IPluginRuntimeExportsAccessor {
  [propName: string]: any;
}

export type IPluginRuntime = IPluginRuntimeCore & IPluginRuntimeExportsAccessor;
