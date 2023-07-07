import type { IPublicPluginContext, IPublicPlugin, IRouterContext } from '@etfma/types';
import type { App } from 'vue';
import { register } from './register';

const PluginRouter: IPublicPlugin = (ctx: IPublicPluginContext, options: any) => {
  return {
    init: () => {
      const app = ctx.global.get('app') as App;
      const config = ctx.preference.getPreference() as unknown as IRouterContext;

      const router = register(config, options);
      app.use(router);
    },
  };
};

PluginRouter.pluginName = 'PluginRouter';

export default PluginRouter;

export { addDynamicRoute } from './convention';

export { register, router } from './register';

export * from './usePage';

export type { IRouterContext, AppRouteRecordRaw, AppRouteModule } from '@etfma/types';

export * from 'vue-router';
