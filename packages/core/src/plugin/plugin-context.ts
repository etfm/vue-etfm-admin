import { EngineConfig, engineConfig } from '../config/config';
import { Logger } from '@etfma/shared';
import { isValidPreferenceKey } from './plugin-utils';
import { createModuleEventBus } from '../core/event-bus';
import type {
  IPluginContextApiAssembler,
  IPluginContextOptions,
  IPluginPreferenceMananger,
  IPublicApiCommon,
  IPublicApiEditor,
  IPublicApiEvent,
  IPublicApiGlobal,
  IPublicApiMaterial,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicPluginContext,
  IPublicTypePluginDeclaration,
  IPublicTypePreferenceValueType,
} from '@etfma/types';

export default class PluginContext implements IPublicPluginContext {
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
  common: IPublicApiCommon;

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

    this.preference = {
      getPreferenceValue,
    };
  }
}
