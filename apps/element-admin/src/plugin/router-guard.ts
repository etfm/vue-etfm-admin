import { setupRouterGuard } from '@/router/guard';
import { IPublicPlugin, IPublicPluginContext, globalRouter } from '@etfma/core';

const PluginRouterGuard: IPublicPlugin = (_: IPublicPluginContext) => {
  return {
    init() {
      setupRouterGuard(globalRouter.router);
    },
  };
};

PluginRouterGuard.pluginName = 'PluginRouterGuard';

export default PluginRouterGuard;
