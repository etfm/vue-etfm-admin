import { engineConfig } from '../config';
import { Logger } from '@etfm/shared';
import { PluginRuntime } from './plugin';
import PluginContext from './plugin-context';
import sequencify from './sequencify';
import semverSatisfies from 'semver/functions/satisfies';
import {
  IPluginManager,
  IPluginRuntime,
  IPluginPreference,
  IPluginContextApiAssembler,
  IPluginContextOptions,
  IPublicPlugin,
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
} from '@etfm/types';

const logger = new Logger({ bizName: 'pluginManager' });

// 保留的事件前缀
const RESERVED_EVENT_PREFIX = ['skeleton', 'plugin', 'dockpane'];

export class PluginManager implements IPluginManager {
  private plugins: IPluginRuntime[] = [];

  pluginsMap: Map<string, IPluginRuntime> = new Map();
  pluginContextMap: Map<string, PluginContext> = new Map();

  private pluginPreference?: IPluginPreference = new Map();

  contextApiAssembler: IPluginContextApiAssembler;

  constructor(contextApiAssembler: IPluginContextApiAssembler) {
    this.contextApiAssembler = contextApiAssembler;
  }

  _getPluginContext(options: IPluginContextOptions) {
    const { pluginName } = options;
    let context = this.pluginContextMap.get(pluginName);
    if (!context) {
      context = new PluginContext(options, this.contextApiAssembler);
      this.pluginContextMap.set(pluginName, context);
    }
    return context;
  }

  isEngineVersionMatched(versionExp: string): boolean {
    const engineVersion = engineConfig.get('version');
    // ref: https://github.com/npm/node-semver#functions
    // 1.0.1-beta should match '^1.0.0'
    return semverSatisfies(engineVersion, versionExp, {
      includePrerelease: true,
    });
  }

  /**
   * register a plugin
   * @param pluginConfigCreator - a creator function which returns the plugin config
   * @param options - the plugin options
   * @param registerOptions - the plugin register options
   */
  async register(
    pluginModel: IPublicPlugin,
    options?: any,
    registerOptions?: IPublicTypePluginRegisterOptions,
  ): Promise<void> {
    // registerOptions maybe in the second place
    let { pluginName, meta = {} } = pluginModel;
    const { engines } = meta;
    // filter invalid eventPrefix
    const { eventPrefix } = meta;
    const isReservedPrefix = RESERVED_EVENT_PREFIX.find((item) => item === eventPrefix);
    if (isReservedPrefix) {
      meta.eventPrefix = undefined;
      logger.warn(
        `plugin ${pluginName} is trying to use ${eventPrefix} as event prefix, which is a reserved event prefix, please use another one`,
      );
    }
    const ctx = this._getPluginContext({ pluginName, meta });

    const config = pluginModel(ctx, options);

    ctx.setPreference(pluginName);

    const allowOverride = registerOptions?.override === true;

    if (this.pluginsMap.has(pluginName)) {
      if (!allowOverride) {
        throw new Error(`Plugin with name ${pluginName} exists`);
      } else {
        // clear existing plugin
        const originalPlugin = this.pluginsMap.get(pluginName);
        logger.log(
          'plugin override, originalPlugin with name ',
          pluginName,
          ' will be destroyed, config:',
          originalPlugin?.config,
        );
        originalPlugin?.destroy();
        this.pluginsMap.delete(pluginName);
      }
    }

    const engineVersionExp = engines && engines.version;
    if (engineVersionExp && !this.isEngineVersionMatched(engineVersionExp)) {
      throw new Error(
        `plugin ${pluginName} skipped, engine check failed, current engine version is ${engineConfig.get(
          'version',
        )}, meta.engines.version is ${engineVersionExp}`,
      );
    }

    const plugin = new PluginRuntime(pluginName, this, config, meta, registerOptions);
    // support initialization of those plugins which registered after normal initialization by plugin-manager
    if (registerOptions?.autoInit) {
      await plugin.init();
    }
    this.plugins.push(plugin);
    this.pluginsMap.set(pluginName, plugin);

    logger.log(`plugin registered with pluginName: ${pluginName}, config:`, config, 'meta:', meta);
  }

  get(pluginName: string): IPluginRuntime | undefined {
    return this.pluginsMap.get(pluginName);
  }

  getAll(): IPluginRuntime[] {
    return this.plugins;
  }

  has(pluginName: string): boolean {
    return this.pluginsMap.has(pluginName);
  }

  async delete(pluginName: string): Promise<boolean> {
    const idx = this.plugins.findIndex((plugin) => plugin.name === pluginName);
    if (idx === -1) return false;
    const plugin = this.plugins[idx];
    await plugin.destroy();

    this.plugins.splice(idx, 1);
    return this.pluginsMap.delete(pluginName);
  }

  async init(pluginPreference?: IPluginPreference) {
    const pluginNames: string[] = [];
    const pluginObj: { [name: string]: IPluginRuntime } = {};
    this.pluginPreference = pluginPreference;

    const presets = this.plugins.filter((preset) => preset.preset);

    await Promise.all(presets.map(async (preset) => preset.init()));

    this.plugins.forEach((plugin) => {
      if (plugin.preset) return;
      pluginNames.push(plugin.name);
      pluginObj[plugin.name] = plugin;
    });
    const { sequence } = sequencify(pluginObj, pluginNames);
    logger.log('load plugin sequence:', sequence);

    for (const pluginName of sequence) {
      try {
        await this.pluginsMap.get(pluginName)!.init();
      } catch (e) {
        logger.error(
          `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`,
        );
        logger.error(e);
      }
    }
  }

  async destroy() {
    for (const plugin of this.plugins) {
      await plugin.destroy();
    }
  }

  get size() {
    return this.pluginsMap.size;
  }

  getPluginPreference(
    pluginName: string,
  ): Record<string, IPublicTypePreferenceValueType> | null | undefined {
    if (!this.pluginPreference) {
      return null;
    }
    return this.pluginPreference.get(pluginName);
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (target.pluginsMap.has(prop as string)) {
          // 禁用态的插件，直接返回 undefined
          if (target.pluginsMap.get(prop as string)!.disabled) {
            return undefined;
          }
          return target.pluginsMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  setDisabled(pluginName: string, flag = true) {
    logger.warn(`plugin:${pluginName} has been set disable:${flag}`);
    this.pluginsMap.get(pluginName)?.setDisabled(flag);
  }

  async dispose() {
    await this.destroy();
    this.plugins = [];
    this.pluginsMap.clear();
  }
}
