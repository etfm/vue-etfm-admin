import type { IPublicPluginContext, IPublicTypePlugin, IRouterContext } from '@etfma/types';
import type { App } from 'vue';
import { register } from './register';

const PluginRouter: IPublicTypePlugin = (ctx: IPublicPluginContext, options: any) => {
  return {
    init: () => {
      const app = ctx.global.get('app') as App;
      const config = ctx.preference.getPreferenceValue('PluginRouter') as unknown as IRouterContext;

      const router = register(options, config);
      app.use(router);
    },
  };
};

PluginRouter.pluginName = 'PluginRouter';

PluginRouter.meta = {
  preferenceDeclaration: {
    title: 'PluginRouter',
    properties: [
      {
        key: 'historyType',
        type: 'string',
        description: 'this is description for historyType',
      },
      {
        key: 'basename',
        type: 'string',
        description: 'basename',
      },
      {
        key: 'routes',
        type: 'array',
        description: 'routes',
      },
      {
        key: 'rouls',
        type: 'array',
        description: 'rouls',
      },
    ],
  },
};

export default PluginRouter;

export { addDynamicRoute } from './convention';

export { register, router } from './register';

export * from './usePage';

export type { IRouterContext, AppRouteRecordRaw, AppRouteModule } from '@etfma/types';

export * from 'vue-router';
