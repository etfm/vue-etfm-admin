import type { IPublicPlugin, IPublicPluginContext } from '@etfma/core';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import AppLogo from '@/layouts/components/logo/AppLogo.vue';

/**
 * 设置logo
 * @param _
 * @returns
 */
const PluginAppLogo: IPublicPlugin = (_: IPublicPluginContext) => {
  return {
    init() {
      skeleton.add({
        name: 'logo',
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
