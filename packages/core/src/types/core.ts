/* eslint-disable max-len */
import { EventEmitter } from 'events';
import { IPublicApiEvent } from './api/event';
import { Editor } from '../core/core';

export type IPublicTypeEditorValueKey = (new (...args: any[]) => any) | symbol | string;

export type IPublicTypeEditorGetResult<T, ClsType> = T extends undefined
  ? ClsType extends {
      prototype: infer R;
    }
    ? R
    : any
  : T;

export interface IPublicTypeEditorGetOptions {
  forceNew?: boolean;
  sourceCls?: new (...args: any[]) => any;
}

export interface IPublicTypeEditorRegisterOptions {
  /**
   * default: true
   */
  singleton?: boolean;

  /**
   * if data a class, auto new a instance.
   * if data a function, auto run(lazy).
   *  default: true
   */
  autoNew?: boolean;
}

export interface EventConfig {
  [eventName: string]: any;
}

export interface IPublicModelEditor extends EventEmitter, EventConfig {
  get: <T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
    opt?: IPublicTypeEditorGetOptions,
  ) => IPublicTypeEditorGetResult<T, KeyOrType> | undefined;

  has: (keyOrType: IPublicTypeEditorValueKey) => boolean;

  set: (key: IPublicTypeEditorValueKey, data: any) => void | Promise<void>;

  onceGot: <T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
  ) => Promise<IPublicTypeEditorGetResult<T, KeyOrType>>;

  onGot: <T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
    fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void,
  ) => () => void;

  register: (
    data: any,
    key?: IPublicTypeEditorValueKey,
    options?: IPublicTypeEditorRegisterOptions,
  ) => void;

  get eventBus(): IPublicApiEvent;

  // setAssets(assets: any): void;
}

export interface EditorConfig {
  skeleton?: SkeletonConfig;
  theme?: ThemeConfig;
  plugins?: PluginsConfig;
  constants?: ConstantsConfig;
  i18n?: I18nConfig;
}
export type ConstantsConfig = Record<string, unknown>;

export interface SkeletonConfig {
  config: any;
  props?: Record<string, unknown>;
  handler?: (config: EditorConfig) => EditorConfig;
}

export interface I18nMessages {
  [key: string]: string;
}

export interface I18nConfig {
  'zh-CN'?: I18nMessages;
  'zh-TW'?: I18nMessages;
  'en-US'?: I18nMessages;
  'ja-JP'?: I18nMessages;
}

export interface ThemeConfig {
  [x: string]: any;
}

export interface PluginsConfig {
  [key: string]: PluginConfig[];
}

export interface PluginConfig {
  pluginKey: string;
  type: string;
  props: {
    icon?: string;
    title?: string;
    width?: number;
    height?: number;
    visible?: boolean;
    disabled?: boolean;
    marked?: boolean;
    align?: 'left' | 'right' | 'top' | 'bottom';
    onClick?: () => void;
    panelProps?: Record<string, unknown>;
  };
  config?: any;
  pluginProps?: Record<string, unknown>;
}

export type PluginClass = ComponentType<PluginProps> & {
  init?: (editor: IPublicModelEditor) => void;
  defaultProps?: {
    locale?: LocaleType;
    messages?: I18nMessages;
  };
};

export interface PluginProps {
  engineEditor: Editor;
}
export interface PluginClassSet {
  [key: string]: PluginClass;
}

export type LocaleType = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP';
