import type { IPublicTypeEditorGetResult, IPublicTypeEditorValueKey } from '@etfm/types';
import { Config, IConfig } from './config';

export class Material {
  config: IConfig;

  constructor() {
    this.config = new Config();
  }

  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeEditorGetResult<T, KeyOrType> | undefined {
    return this.config.get(keyOrType);
  }

  has(keyOrType: any): boolean {
    return this.config.has(keyOrType);
  }

  set(key: IPublicTypeEditorValueKey, data: any): void | Promise<void> {
    this.config.set(key, data);
  }

  async setAssets(key: string, assets: any) {
    this.set(key, assets);
  }

  onGot(key: any, fn: (data: any) => void): () => void {
    return this.config.onGot(key, fn);
  }
}

export const createMaterial = () => {
  return new Material();
};
