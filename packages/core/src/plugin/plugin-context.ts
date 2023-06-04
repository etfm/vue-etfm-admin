import { EngineConfig, engineConfig } from '../config/config';
import { ILowCodePluginManager } from './plugin-types';
import { Logger } from '@etfma/shared';
import {
  ILowCodePluginContext,
  IPluginContextOptions,
  ILowCodePluginPreferenceDeclaration,
  PreferenceValueType,
  IPluginPreferenceMananger,
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
} from './plugin-types';
import { isValidPreferenceKey } from './plugin-utils';
import { IPublicApiEditor, IPublicApiEvent, IPublicApiSkeleton } from '../types/api';
import { IPublicApiGlobal } from '../types/api/global';

export default class PluginContext implements ILowCodePluginContext, ILowCodePluginContextPrivate {
  skeleton: IPublicApiSkeleton;
  event: IPublicApiEvent;
  config: EngineConfig;
  global: IPublicApiGlobal;
  editor: IPublicApiEditor;

  logger: Logger;
  plugins: ILowCodePluginManager;
  preference: IPluginPreferenceMananger;

  constructor(
    plugins: ILowCodePluginManager,
    options: IPluginContextOptions,
    contextApiAssembler: ILowCodePluginContextApiAssembler,
  ) {
    contextApiAssembler.assembleApis(this);
    this.plugins = plugins;
    const { pluginName = 'anonymous' } = options;
    this.logger = new Logger({ bizName: `plugin:${pluginName}` });

    const enhancePluginContextHook = engineConfig.get('enhancePluginContextHook');
    if (enhancePluginContextHook) {
      enhancePluginContextHook(this);
    }
  }

  setPreference(
    pluginName: string,
    preferenceDeclaration: ILowCodePluginPreferenceDeclaration,
  ): void {
    const getPreferenceValue = (
      key: string,
      defaultValue?: PreferenceValueType,
    ): PreferenceValueType | undefined => {
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
