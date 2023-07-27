import { IPublicPlugin, IPublicPluginContext, common, material } from '@etfma/core';
import zhCN from '@/locales/lang/zh_CN';
import { setupRouterGuard } from '@/router/guard';

/**
 * 设置初始化
 * @param _
 * @returns
 */
const PluginInit: IPublicPlugin = (_: IPublicPluginContext) => {
  return {
    init() {
      // 设置多语言
      material.setAssets('locale', zhCN);
      // 设置路由拦截器
      const { router } = common.utils.createRouter();
      setupRouterGuard(router);
    },
  };
};

PluginInit.meta = {
  dependencies: ['PluginPinia'],
};

PluginInit.pluginName = 'PluginInit';

export default PluginInit;
