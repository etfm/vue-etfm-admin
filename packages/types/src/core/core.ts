import type { EventEmitter } from 'events';
import { IEventBus } from './event-bus';

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

export interface IPublicModelEditor extends EventEmitter {
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

  get eventBus(): IEventBus;

  [eventName: string]: any;
}

export interface IEditor extends IPublicModelEditor {}
