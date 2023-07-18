import type { IPublicPlugin, IPublicPluginContext } from '@etfma/core';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import AppLogo from './index.vue';

/**
 * 设置logo
 * @param _
 * @returns
 */
const PluginAppLogo: IPublicPlugin = (_: IPublicPluginContext) => {
  return {
    init() {
      skeleton.add({
        name: 'PluginAppLogo',
        area: 'header',
        props: {
          align: 'left',
        },
        content: h(AppLogo),
      });
    },
  };
};

PluginAppLogo.pluginName = 'PluginAppLogo';

export default PluginAppLogo;
