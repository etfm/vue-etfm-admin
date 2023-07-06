import { createApp, h } from 'vue';
import { Editor, commonEvent } from './editor';
import { Skeleton as InnerSkeleton } from './layout';
import { Skeleton, Material, Event, Global, Plugins, Config } from './shell';
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
import { GlobalRouter } from './router/router';

export * from './router';

export * from './types';

const global = new Global(globalContext);

const editor = new Editor();
globalContext.register(editor, Editor);
globalContext.register(editor, 'editor');

const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton', innerSkeleton);

const material = new Material(editor);
editor.set('material', material);

const skeleton = new Skeleton(innerSkeleton, 'any');
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

engineConfig.set('app', app);
globalContext.register(app, 'app');

const router = new GlobalRouter(app).router;
engineConfig.set('router', router);
globalContext.register(router, 'router');

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
    context.router = router;
    context.global = global;
    context.plugins = plugins;
    context.logger = new Logger({ bizName: `plugin:${pluginName}` });
  },
};

const innerPlugins = new PluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
editor.set('innerPlugins', innerPlugins);
editor.set('plugins', plugins);

export { skeleton, plugins, material, config, event, logger, global, router };
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
  symbols,
  classes,
};

export const version = jsonPkg.version;
engineConfig.set('ENGINE_VERSION', version);

// container which will host LowCodeEngine DOM
let engineContainer: HTMLElement | undefined;

export async function init(
  container?: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: IPluginPreference,
) {
  await destroy();
  let engineOptions: IPublicTypeEngineOptions | HTMLElement | undefined | null = null;
  if (lodash.isPlainObject(container)) {
    engineOptions = container;
    engineContainer = document.createElement('div');
    engineContainer.id = 'engine';
    document.body.appendChild(engineContainer);
  } else {
    engineOptions = options;
    engineContainer = container;
    if (!container) {
      engineContainer = document.createElement('div');
      engineContainer.id = 'engine';
      document.body.appendChild(engineContainer);
    }
  }

  engineConfig.setEngineOptions(engineOptions as any);

  await plugins.init(pluginPreference);

  app.mount(engineContainer as Element);
}

export async function destroy() {
  // remove all documents
  // TODO: delete plugins except for core plugins
  // unmount DOM container, this will trigger React componentWillUnmount lifeCycle,
  // so necessary cleanups will be done.
  app && app.unmount();
}
