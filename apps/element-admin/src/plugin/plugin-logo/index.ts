import type { IPublicPlugin, IPublicPluginContext } from '@etfma/core';
import { skeleton, config } from '@etfma/core';
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
        name: 'PluginHeaderAppLogo',
        area: 'header',
        props: {
          align: 'left',
        },
        visible: false,
        content: h(AppLogo),
      });

      skeleton.add({
        name: 'PluginAsideAppLogo',
        area: 'aside',
        props: {
          align: 'left',
        },

        content: h(AppLogo),
      });

      config.onGot('layout', (l: string) => {
        if (l === 'aside') {
          skeleton.hideWidget('PluginHeaderAppLogo');
          skeleton.showWidget('PluginAsideAppLogo');
        } else {
          skeleton.hideWidget('PluginAsideAppLogo');
          skeleton.showWidget('PluginHeaderAppLogo');
        }
      });
    },
  };
};

PluginAppLogo.pluginName = 'PluginAppLogo';

export default PluginAppLogo;
