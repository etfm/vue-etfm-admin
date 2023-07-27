import { EventEmitter } from 'events';
import { observable, define } from './obx';
import { EventBus } from './event-bus';
import type { IEditor, IPublicTypeEditorGetResult, IPublicTypeEditorValueKey } from '@etfma/types';
import { EngineConfig, engineConfig } from './config';
import { Logger } from '@etfma/shared';

// inner instance keys which should not be stored in config
const keyBlacklist = ['skeleton', 'plugins', 'material', 'innerPlugins', 'routes', 'locale', 'app'];
const keyAssetsList = ['routes', 'locale'];
const logger = new Logger({ bizName: 'material' });

export class Editor extends EventEmitter implements IEditor {
  context = new Map<IPublicTypeEditorValueKey, any>();
  config: EngineConfig;

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
    this.config = engineConfig;
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
    this.context.set(key, data);
    this.notifyGot(key);
  }

  async setAssets(key: string, assets: any) {
    if (keyAssetsList.includes(key)) {
      await this.set(key, assets);
    } else {
      logger.warn(`failed to config ${key} to material, 资源注册只支持${keyAssetsList}`);
    }
  }

  registerAssets(data: any, key?: IPublicTypeEditorValueKey) {
    // 避免覆盖别的资源
    if (keyAssetsList.includes(key || data)) {
      logger.warn(`failed to config ${key || data} to material, 该资源已被注册：${keyAssetsList}`);
      return;
    }
    keyAssetsList.push(key || data);
    this.set(key || data, data);
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
    if (keyBlacklist.includes(key || data)) {
      logger.warn(`failed to config ${key || data} to global, 该配置已被注册：${keyBlacklist}`);
      return;
    }
    keyBlacklist.push(key || data);
    this.set(key || data, data);
  }

  destroy(): void {
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

export const editor = new Editor();

export const commonEvent = new EventBus(new EventEmitter());
