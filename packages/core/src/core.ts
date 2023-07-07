import { createApp, h } from 'vue';
import { Editor, commonEvent } from './editor';
import { Skeleton as InnerSkeleton } from './layout';
import {
  Skeleton,
  Material,
  Event,
  Global,
  Plugins,
  Config,
  GlobalI18n,
  GlobalRouter,
} from './shell';
import { lodash, Logger } from '@etfma/shared';

import jsonPkg from '../../../package.json';
import { engineConfig } from './config';

import symbols from './symbols';
import classes from './classes';
import { globalContext } from './ioc-context';
import {
  IPluginContextApiAssembler,
  IPluginContextPrivate,
  IPluginPreference,
  IPublicApiPlugins,
  IPublicTypeEngineOptions,
  IPublicTypePluginMeta,
} from '@etfma/types';
import { PluginManager } from './plugin';

import { Workbench } from './layout';
import { GlobalRouter as InnerGlobalRouter, ROUTER_OPTIONS } from './router/router';
import { INTL_OPTIONS, GlobalI18n as InnerGlobalI18n } from './intl/i18n';

export * from './router';
export * from './intl';

export * from './types';

const global = new Global(globalContext);

const editor = new Editor();
globalContext.register(editor, Editor);
globalContext.register(editor, 'editor');

const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton', innerSkeleton);

const material = new Material(editor);
editor.set('material', material);

const skeleton = new Skeleton(innerSkeleton);
const config = new Config(engineConfig);
const event = new Event(commonEvent, { prefix: 'common' });
const logger = new Logger({ bizName: 'common' });

const app = createApp({
  render: () =>
    h(Workbench, {
      skeleton: innerSkeleton,
      class: 'engine-main',
    }),
});

editor.set('app', app);
engineConfig.set('app', app);
globalContext.register(app, 'app');

const innerGlobalRouter = new InnerGlobalRouter(editor);
editor.set('router', innerGlobalRouter);
const globalRouter = new GlobalRouter(innerGlobalRouter);

const innerGlobalI18n = new InnerGlobalI18n(editor);
editor.set('i18n', innerGlobalI18n);
const globalI18n = new GlobalI18n(innerGlobalI18n);

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
    context.globalRouter = globalRouter;
    context.globalI18n = globalI18n;
    context.global = global;
    context.plugins = plugins;
    context.logger = new Logger({ bizName: `plugin:${pluginName}` });
  },
};

const innerPlugins = new PluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
editor.set('innerPlugins', innerPlugins);
editor.set('plugins', plugins);

export { skeleton, plugins, material, config, event, logger, global, globalRouter, globalI18n };
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  symbols,
  classes,
};

export const version = jsonPkg.version;
engineConfig.set('ENGINE_VERSION', version);

let engineContainer: HTMLElement | undefined;

export async function init(
  container?: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: IPluginPreference,
) {
  let engineOptions: IPublicTypeEngineOptions;
  if (lodash.isPlainObject(container)) {
    engineOptions = container as IPublicTypeEngineOptions;
    engineContainer = document.createElement('div');
    engineContainer.id = 'engine';
    document.body.appendChild(engineContainer);
  } else {
    engineOptions = options!;
    engineContainer = container;
    if (!container) {
      engineContainer = document.createElement('div');
      engineContainer.id = 'engine';
      document.body.appendChild(engineContainer);
    }
  }

  engineOptions = merge(engineOptions);

  engineConfig.setEngineOptions(engineOptions);

  await plugins.init(pluginPreference);

  app.mount(engineContainer as Element);
}

function merge(engineOptions: IPublicTypeEngineOptions) {
  // 触发通知router挂载到vue上
  const router = lodash.merge(ROUTER_OPTIONS, engineOptions?.router);
  // 触发通知i18n挂载到vue上
  const i18n = lodash.merge(INTL_OPTIONS, engineOptions?.i18n);

  return {
    ...engineOptions,
    router,
    i18n,
  };
}
