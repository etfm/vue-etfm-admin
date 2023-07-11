import { IPublicPlugin, IPublicPluginContext, material } from '@etfma/core';
import zhCN from '@/locales/lang/zh_CN';

/**
 * 设置多语言
 * @param _
 * @returns
 */
const PluginLocale: IPublicPlugin = (_: IPublicPluginContext) => {
  return {
    init() {
      material.setAssets('locale', zhCN);
    },
  };
};

PluginLocale.pluginName = 'PluginLocale';

export default PluginLocale;
