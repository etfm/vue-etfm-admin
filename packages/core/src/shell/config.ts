import {
  IPluginTypeConfig,
  IPublicApiConfig,
  IPublicModelPreference,
  IPublicTypeDisposable,
} from '@etfma/types';
import { IEngineConfig } from '../config';
import { configSymbol } from './symbols';

export class Config implements IPublicApiConfig {
  private readonly [configSymbol]: IEngineConfig;

  constructor(innerEngineConfig: IEngineConfig) {
    this[configSymbol] = innerEngineConfig;
  }

  has(key: IPluginTypeConfig): boolean {
    return this[configSymbol].has(key);
  }

  get(key: IPluginTypeConfig, defaultValue?: any): any {
    return this[configSymbol].get(key, defaultValue);
  }

  set(key: IPluginTypeConfig, value: any): void {
    this[configSymbol].set(key, value);
  }

  setConfig(config: { [key: string]: any }): void {
    this[configSymbol].setConfig(config);
  }

  onceGot(key: IPluginTypeConfig): Promise<any> {
    return this[configSymbol].onceGot(key);
  }

  onGot(key: IPluginTypeConfig, fn: (data: any) => void): IPublicTypeDisposable {
    return this[configSymbol].onGot(key, fn);
  }

  getPreference(): IPublicModelPreference {
    return this[configSymbol].getPreference();
  }
}
