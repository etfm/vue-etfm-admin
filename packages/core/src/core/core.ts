import { EventEmitter } from 'events';
import { engineConfig } from '../config/config';
import { observable, define } from '../obx';
import {
  EditorConfig,
  IPublicModelEditor,
  IPublicTypeEditorGetResult,
  IPublicTypeEditorValueKey,
} from '../types/core';
import { EventBus } from './event-bus';

const keyBlacklist = ['skeleton', 'plugins', 'material', 'innerPlugins'];

export interface IEditor extends IPublicModelEditor {
  config?: EditorConfig;

  init(config?: EditorConfig): Promise<any>;
}

export class Editor extends EventEmitter implements IEditor {
  /**
   * Ioc Container
   */
  context = new Map<IPublicTypeEditorValueKey, any>();

  config?: EditorConfig;

  eventBus: EventBus;

  private waits = new Map<
    IPublicTypeEditorValueKey,
    Array<{
      once?: boolean;
      resolve: (data: any) => void;
    }>
  >();

  constructor() {
    super();
    this.setMaxListeners(200);
    this.eventBus = new EventBus(this);
    this.makeObservable();
  }

  makeObservable() {
    define(this, {
      context: observable.shallow,
    });
  }

  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeEditorGetResult<T, KeyOrType> | undefined {
    return this.context.get(keyOrType as any);
  }

  has(keyOrType: IPublicTypeEditorValueKey): boolean {
    return this.context.has(keyOrType);
  }

  set(key: IPublicTypeEditorValueKey, data: any): void | Promise<void> {
    // store the data to engineConfig while invoking editor.set()
    if (!keyBlacklist.includes(key as string)) {
      engineConfig.set(key as any, data);
    }
    this.context.set(key, data);
    this.notifyGot(key);
  }

  onceGot<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
  ): Promise<IPublicTypeEditorGetResult<T, KeyOrType>> {
    const x = this.context.get(keyOrType);
    if (x !== undefined) {
      return Promise.resolve(x);
    }
    return new Promise((resolve) => {
      this.setWait(keyOrType, resolve, true);
    });
  }

  onGot<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
    fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void,
  ): () => void {
    const x = this.context.get(keyOrType);
    if (x !== undefined) {
      fn(x);
    }
    this.setWait(keyOrType, fn);
    return () => {
      this.delWait(keyOrType, fn);
    };
  }

  register(data: any, key?: IPublicTypeEditorValueKey): void {
    this.context.set(key || data, data);
    this.notifyGot(key || data);
  }

  async init(config?: EditorConfig): Promise<any> {
    this.config = config || {};

    this.emit('editor.beforeInit');

    try {
      this.emit('editor.afterInit');

      return true;
    } catch (err) {
      console.error(err);
    }
  }

  destroy(): void {
    if (!this.config) {
      return;
    }
    try {
    } catch (err) {
      console.warn(err);
    }
  }

  private notifyGot(key: IPublicTypeEditorValueKey) {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }

  private setWait(key: IPublicTypeEditorValueKey, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: IPublicTypeEditorValueKey, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
}

export const commonEvent = new EventBus(new EventEmitter());
