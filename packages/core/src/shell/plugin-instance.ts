import { IPluginRuntime, IPublicModelPluginInstance } from '@etfm/types';
import { pluginInstanceSymbol } from './symbols';

export class PluginInstance implements IPublicModelPluginInstance {
  private readonly [pluginInstanceSymbol]: IPluginRuntime;

  constructor(pluginInstance: IPluginRuntime) {
    this[pluginInstanceSymbol] = pluginInstance;
  }

  inited: boolean;

  dispose(): void {
    this[pluginInstanceSymbol].dispose();
  }

  init(forceInit?: boolean | undefined): void {
    this[pluginInstanceSymbol].init(forceInit);
  }

  get pluginName(): string {
    return this[pluginInstanceSymbol].name;
  }

  get dep(): string[] {
    return this[pluginInstanceSymbol].dep;
  }

  get disabled(): boolean {
    return this[pluginInstanceSymbol].disabled;
  }

  set disabled(disabled: boolean) {
    this[pluginInstanceSymbol].setDisabled(disabled);
  }

  get meta() {
    return this[pluginInstanceSymbol].meta;
  }
}
