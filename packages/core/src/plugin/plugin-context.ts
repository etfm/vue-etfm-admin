import { EngineConfig, engineConfig } from '../config';
import { Logger } from '@etfma/shared';
import { createModuleEventBus } from '../event-bus';
import type {
  IPluginContextApiAssembler,
  IPluginContextOptions,
  IPluginPreferenceMananger,
  IPublicApiEditor,
  IPublicApiEvent,
  IPublicApiGlobal,
  IPublicApiI18n,
  IPublicApiMaterial,
  IPublicApiPlugins,
  IPublicApiRouter,
  IPublicApiSkeleton,
  IPublicApiTheme,
  IPublicModelPluginContext,
  IPublicTypePreferenceValueType,
} from '@etfma/types';

export default class PluginContext implements IPublicModelPluginContext {
  skeleton: IPublicApiSkeleton;
  event: IPublicApiEvent;
  config: EngineConfig;
  global: IPublicApiGlobal;
  editor: IPublicApiEditor;
  i18n: IPublicApiI18n;
  router: IPublicApiRouter;
  theme: IPublicApiTheme;
  logger: Logger;
  plugins: IPublicApiPlugins;
  preference: IPluginPreferenceMananger;
  material: IPublicApiMaterial;
  pluginEvent: IPublicApiEvent;

  constructor(options: IPluginContextOptions, contextApiAssembler: IPluginContextApiAssembler) {
    const { pluginName = 'anonymous', meta = {} } = options;
    contextApiAssembler.assembleApis(this, pluginName, meta);
    this.pluginEvent = createModuleEventBus(pluginName, 200);
  }

  setPreference(pluginName: string): void {
    const getPreferenceValue = (
      key: string,
      defaultValue?: IPublicTypePreferenceValueType,
    ): IPublicTypePreferenceValueType | undefined => {
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
