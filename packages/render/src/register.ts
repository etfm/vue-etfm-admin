import { createPluginManager, getPluginManager } from '@etfm/vea-plugin';
import { lodash } from '@etfm/vea-shared';
import { initRender } from './renderer';
import RootApp from './App';
import { IRenderContext } from '@etfm/vea-types';

export let context: IRenderContext = {
  rootElement: document.getElementById('app') as Element,
  rootContainer: () => RootApp,
  onRouterCreated: () => {},
  onPiniaCreated: () => {},
  onAppCreated: () => {},
  onMounted: () => {},
};

export async function register(opts?: IRenderContext) {
  const pluginManager = await createPluginManager();
  // 收集配置信息
  const render = getPluginManager().applyPlugins({
    key: 'render',
  });

  context = lodash.merge(context, opts, render);

  return initRender({ pluginManager });
}

register();
