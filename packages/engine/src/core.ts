import { Skeleton as InnerSkeleton } from './layout';
import { Skeleton, Material, Event, Global, Plugins, Config, Theme, Intl, Route } from './shell';
import { Logger } from '@etfm/shared';

import jsonPkg from '../../../package.json';

import {
  IPluginContextApiAssembler,
  IPluginContextPrivate,
  IPluginPreference,
  IPublicApiPlugins,
  IPublicTypeEngineOptions,
  IPublicTypePluginMeta,
} from '@etfm/types';
import { PluginManager } from './plugin';

import { globalI18n } from './i18n/i18n';
import { globalRouter } from './router/router';
import { globalTheme } from './theme/theme';
import { Global as InnerGlobal } from './global';
import { engineConfig } from './engine-config';
import { commonEvent } from './event-bus';
import { Material as InnerMaterial } from './material';

export * from './router';
export * from './i18n';

export * from './types';

const innerGlobal = new InnerGlobal();
const global = new Global(innerGlobal);

const innerSkeleton = new InnerSkeleton();
const skeleton = new Skeleton(innerSkeleton);
global.set('skeleton', innerSkeleton);

const theme = new Theme(globalTheme);
global.set('theme', theme);

const i18n = new Intl(globalI18n);
global.set('i18n', i18n);

const router = new Route(globalRouter);
global.set('router', router);

const innerMaterial = new InnerMaterial();
const material = new Material(innerMaterial);
global.set('material', material);

const config = new Config(engineConfig);

const event = new Event(commonEvent, { prefix: 'common' });

const logger = new Logger({ bizName: 'common' });

let plugins: IPublicApiPlugins;

const pluginContextApiAssembler: IPluginContextApiAssembler = {
  assembleApis: (
    context: IPluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ) => {
    context.skeleton = skeleton;
    context.material = material;
    const eventPrefix = meta?.eventPrefix || 'common';
    context.event = new Event(commonEvent, { prefix: eventPrefix });
    context.config = config;
    context.global = global;
    context.plugins = plugins;
    context.logger = new Logger({ bizName: `plugin:${pluginName}` });
  },
};

const innerPlugins = new PluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
global.set('innerPlugins', innerPlugins);
global.set('plugins', plugins);

export { skeleton, plugins, material, config, event, logger, global, theme, i18n, router };

// 全局属性
(window as any).EtfmEngine = global;

export const version = jsonPkg.version;
config.set('version', version);

export async function init(
  options?: IPublicTypeEngineOptions,
  pluginPreference?: IPluginPreference,
) {
  engineConfig.setEngineOptions(options);

  initInner();

  await plugins.init(pluginPreference);
}

function initInner() {
  globalI18n.init();
  globalRouter.init();
  globalTheme.init();
}
