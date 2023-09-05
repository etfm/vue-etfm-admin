import { IPublicPlugin, IPublicPluginContext, material, router } from 'etfm-engine';
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
      setupRouterGuard(router.router);
    },
  };
};

PluginInit.meta = {
  dependencies: ['PluginPinia'],
};

PluginInit.pluginName = 'PluginInit';

export default PluginInit;
