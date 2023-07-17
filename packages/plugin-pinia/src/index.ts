import { register } from './register';
import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import type { App } from 'vue';

const PluginPinia: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const app = ctx.global.get('app') as App;
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const pinia = register(config, options as any);

      app.use(pinia);
    },
  };
};

PluginPinia.pluginName = 'PluginPinia';

export default PluginPinia;

export * from 'pinia';

export { register, store } from './register';

export type { IPiniaContext } from '@etfma/types';
