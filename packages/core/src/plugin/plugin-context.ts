import { EngineConfig, engineConfig } from '../config';
import { Logger } from '@etfma/shared';
import { isValidPreferenceKey } from './plugin-utils';
import { createModuleEventBus } from '../event-bus';
import type {
  IPluginContextApiAssembler,
  IPluginContextOptions,
  IPluginPreferenceMananger,
  IPublicApiEditor,
  IPublicApiEvent,
  IPublicApiGlobal,
  IPublicApiMaterial,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicModelPluginContext,
  IPublicTypePluginDeclaration,
  IPublicTypePreferenceValueType,
  Router,
} from '@etfma/types';

export default class PluginContext implements IPublicModelPluginContext {
  skeleton: IPublicApiSkeleton;
  event: IPublicApiEvent;
  config: EngineConfig;
  global: IPublicApiGlobal;
  editor: IPublicApiEditor;
  logger: Logger;
  plugins: IPublicApiPlugins;
  preference: IPluginPreferenceMananger;
  material: IPublicApiMaterial;
  pluginEvent: IPublicApiEvent;
  router: Router;

  constructor(options: IPluginContextOptions, contextApiAssembler: IPluginContextApiAssembler) {
    const { pluginName = 'anonymous', meta = {} } = options;
    contextApiAssembler.assembleApis(this, pluginName, meta);
    this.pluginEvent = createModuleEventBus(pluginName, 200);
    const enhancePluginContextHook = engineConfig.get('enhancePluginContextHook');
    if (enhancePluginContextHook) {
      enhancePluginContextHook(this);
    }
  }

  setPreference(pluginName: string, preferenceDeclaration: IPublicTypePluginDeclaration): void {
    const getPreferenceValue = (
      key: string,
      defaultValue?: IPublicTypePreferenceValueType,
    ): IPublicTypePreferenceValueType | undefined => {
      if (!isValidPreferenceKey(key, preferenceDeclaration)) {
        return undefined;
      }
      const pluginPreference = this.plugins.getPluginPreference(pluginName) || {};
      if (pluginPreference[key] === undefined || pluginPreference[key] === null) {
        return defaultValue;
      }
      return pluginPreference[key];
    };

    const getPreference = (
      defaultValue?: Record<string, IPublicTypePreferenceValueType>,
    ): Record<string, IPublicTypePreferenceValueType> | undefined | null => {
      const pluginPreference = this.plugins.getPluginPreference(pluginName);
      if (pluginPreference === undefined || pluginPreference === null) {
        return defaultValue;
      }
      return pluginPreference;
    };

    this.preference = {
      getPreferenceValue,
      getPreference,
    };
  }
}
