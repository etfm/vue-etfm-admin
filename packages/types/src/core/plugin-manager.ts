import { IPublicTypePlugin } from './plugin';
import { IPublicPluginContext } from './plugin-context';
import { IPluginContextOptions } from './plugin-context-options';
import { IPublicTypePluginRegisterOptions } from './plugin-register-options';
import { IPublicTypePreferenceValueType } from './preference-value-type';

interface ILowCodePluginManagerPluginAccessor {
  [pluginName: string]: ILowCodePluginRuntime | any;
}

export interface ILowCodePluginManagerCore {
  register(
    pluginModel: IPublicTypePlugin,
    pluginOptions?: any,
    options?: IPublicTypePluginRegisterOptions,
  ): Promise<void>;
  init(
    pluginPreference?: Map<string, Record<string, IPublicTypePreferenceValueType>>,
  ): Promise<void>;
  get(pluginName: string): ILowCodePluginRuntime | undefined;
  getAll(): ILowCodePluginRuntime[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
  _getLowCodePluginContext(options: IPluginContextOptions): IPublicPluginContext;
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;
