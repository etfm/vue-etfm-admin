import { EngineConfig, engineConfig } from '../config/config';
import { Logger } from '@etfma/shared';
import {
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
import { IPublicModelPluginContext } from '../types/plugin-context';
import { IPublicApiPlugins } from '../types/api/plugins';
import { IPublicApiMaterial } from '../types/api/material';
import { createModuleEventBus } from '../core/event-bus';

export default class PluginContext
  implements IPublicModelPluginContext, ILowCodePluginContextPrivate
{
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

  constructor(
    options: IPluginContextOptions,
    contextApiAssembler: ILowCodePluginContextApiAssembler,
  ) {
    const { pluginName = 'anonymous', meta = {} } = options;
    contextApiAssembler.assembleApis(this, pluginName, meta);
    this.pluginEvent = createModuleEventBus(pluginName, 200);
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
