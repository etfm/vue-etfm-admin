import {
  IPublicApiSkeleton,
  IPublicApiEvent,
  IPublicApiGlobal,
  IPublicApiEditor,
} from '../types/api';
import { Logger } from '@etfma/shared';
import { IPublicTypePluginConfig } from '../types/plugin-config';
import { IPublicApiLogger } from '../types/api/logger';
import { IPublicTypePluginMeta } from '../types/plugin-meta';
import { IPublicApiMaterial } from '../types/api/material';
import { IPublicModelPluginContext } from '../types/plugin-context';
import { IPublicApiPlugins } from '../types/api/plugins';
import { IPublicTypePlugin } from '../types/plugin';
import { IPublicTypePluginRegisterOptions } from '../types/plugin-register-options';
import PluginContext from './plugin-context';
import { IPublicModelEngineConfig } from '../types/engine-config';

export type PreferenceValueType = string | number | boolean;

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

export interface ILowCodePluginPreferenceDeclarationProperty {
  // shape like 'name' or 'group.name' or 'group.subGroup.name'
  key: string;
  // must have either one of description & markdownDescription
  description: string;
  // value in 'number', 'string', 'boolean'
  type: string;
  // default value
  // NOTE! this is only used in configuration UI, won`t affect runtime
  default?: PreferenceValueType;
  // only works when type === 'string', default value false
  useMultipleLineTextInput?: boolean;
  // enum values, only works when type === 'string'
  enum?: any[];
  // descriptions for enum values
  enumDescriptions?: string[];
  // message that describing deprecation of this property
  deprecationMessage?: string;
}

/**
 * declaration of plugin`s preference
 * when strictPluginMode === true， only declared preference can be obtained from inside plugin.
 *
 * @export
 * @interface ILowCodePluginPreferenceDeclaration
 */
export interface ILowCodePluginPreferenceDeclaration {
  // this will be displayed on configuration UI, can be plugin name
  title: string;
  properties: ILowCodePluginPreferenceDeclarationProperty[];
}

export type PluginPreference = Map<string, Record<string, PreferenceValueType>>;

export interface ILowCodePluginConfig {
  dep?: string | string[];
  init?(): void;
  destroy?(): void;
  exports?(): any;
}

export interface ILowCodePluginConfigMetaEngineConfig {
  lowcodeEngine?: string;
}
export interface ILowCodePluginConfigMeta {
  preferenceDeclaration?: ILowCodePluginPreferenceDeclaration;
  // 依赖插件名
  dependencies?: string[];
  engines?: ILowCodePluginConfigMetaEngineConfig;
}

export interface ILowCodePluginCore {
  name: string;
  dep: string[];
  disabled: boolean;
  config: ILowCodePluginConfig;
  logger: Logger;
  on(event: string | number, listener: (...args: any[]) => void): any;
  emit(event: string | number, ...args: any[]): boolean;
  removeAllListeners(event?: string | number): this;
  init(forceInit?: boolean): void;
  isInited(): boolean;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

interface ILowCodePluginExportsAccessor {
  [propName: string]: any;
}

export type ILowCodePlugin = ILowCodePluginCore & ILowCodePluginExportsAccessor;

// export interface IDesignerCabin {
//   registerMetadataTransducer: (transducer: MetadataTransducer, level: number, id?: string) => void;
//   addBuiltinComponentAction: (action: ComponentAction) => void;
//   removeBuiltinComponentAction: (actionName: string) => void;
// }

export interface IPluginPreferenceMananger {
  // eslint-disable-next-line max-len
  getPreferenceValue: (
    key: string,
    defaultValue?: PreferenceValueType,
  ) => PreferenceValueType | undefined;
}

export interface ILowCodePluginContextPrivate {
  set skeleton(skeleton: IPublicApiSkeleton);
  set event(event: IPublicApiEvent);
  set config(config: IPublicModelEngineConfig);
  set global(global: IPublicApiGlobal);
  set editor(editor: IPublicApiEditor);
  set material(material: IPublicApiMaterial);
  set plugins(plugins: IPublicApiPlugins);
  set logger(plugins: IPublicApiLogger);
}
export interface ILowCodePluginContextApiAssembler {
  assembleApis: (
    context: ILowCodePluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ) => void;
}

interface ILowCodePluginManagerPluginAccessor {
  [pluginName: string]: ILowCodePluginRuntime | any;
}

export interface ILowCodePluginManagerCore {
  register(
    pluginModel: IPublicTypePlugin,
    pluginOptions?: any,
    options?: IPublicTypePluginRegisterOptions,
  ): Promise<void>;
  init(pluginPreference?: Map<string, Record<string, PreferenceValueType>>): Promise<void>;
  get(pluginName: string): ILowCodePluginRuntime | undefined;
  getAll(): ILowCodePluginRuntime[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
  _getLowCodePluginContext(options: IPluginContextOptions): PluginContext;
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;

export function isLowCodeRegisterOptions(opts: any): opts is ILowCodeRegisterOptions {
  return opts && ('autoInit' in opts || 'override' in opts);
}

export interface ILowCodeRegisterOptions {
  /** Will enable plugin registered with auto-initialization immediately
   * other than plugin-manager init all plugins at certain time.
   * It is helpful when plugin register is later than plugin-manager initialization. */
  autoInit?: boolean;
  /** allow overriding existing plugin with same name when override === true */
  override?: boolean;
}

export interface IPluginContextOptions {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}

export interface IPluginMetaDefinition {
  /** define dependencies which the plugin depends on */
  dependencies?: string[];
  /** specify which engine version is compatible with the plugin */
  engines?: {
    /** e.g. '^1.0.0' */
    lowcodeEngine?: string;
  };
}

interface IPluginConfigCreatorFn<T extends Record<string, any> = Record<string, any>> {
  (ctx: IPublicModelPluginContext, pluginOptions?: T): ILowCodePluginConfig;
}

export type IPluginConfigCreator<T extends Record<string, any> = Record<string, any>> =
  IPluginConfigCreatorFn<T> & {
    pluginName: string;
    meta?: IPluginMetaDefinition;
  };
