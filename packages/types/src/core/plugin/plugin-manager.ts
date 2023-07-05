import { IPublicTypePlugin } from './plugin';
import { IPublicPluginContext } from './plugin-context';
import { IPluginContextOptions } from './plugin-context-options';
import { IPublicTypePluginRegisterOptions } from './plugin-register-options';
import { IPublicTypePreferenceValueType } from '../preference-value-type';
import { IPluginRuntime } from './plugin-runtime';

interface IPluginManagerPluginAccessor {
  [pluginName: string]: IPluginRuntime | any;
}

export interface IPluginManagerCore {
  register(
    pluginModel: IPublicTypePlugin,
    pluginOptions?: any,
    options?: IPublicTypePluginRegisterOptions,
  ): Promise<void>;
  init(
    pluginPreference?: Map<string, Record<string, IPublicTypePreferenceValueType>>,
  ): Promise<void>;
  get(pluginName: string): IPluginRuntime | undefined;
  getAll(): IPluginRuntime[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
  _getPluginContext(options: IPluginContextOptions): IPublicPluginContext;
}

export type IPluginManager = IPluginManagerCore & IPluginManagerPluginAccessor;

export interface IPluginPreferenceMananger {
  getPreferenceValue: (
    key: string,
    defaultValue?: IPublicTypePreferenceValueType,
  ) => IPublicTypePreferenceValueType | undefined;

  getPreference: (
    defaultValue?: Record<string, IPublicTypePreferenceValueType>,
  ) => Record<string, IPublicTypePreferenceValueType> | undefined | null;
}

export type PluginOptionsType = string | number | boolean | object;
