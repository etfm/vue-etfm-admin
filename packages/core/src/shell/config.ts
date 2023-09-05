import {
  IPluginTypeConfig,
  IPublicApiConfig,
  IPublicKeyType,
  IPublicModelPreference,
  IPublicTypeDisposable,
} from '@etfm/types';
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

  get(key: IPluginTypeConfig, defaultValue?: IPublicKeyType): any {
    return this[configSymbol].get(key, defaultValue);
  }

  set(key: IPluginTypeConfig, value: IPublicKeyType): void {
    this[configSymbol].set(key, value);
  }

  setConfig(config: { [key: string]: IPublicKeyType }): void {
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
