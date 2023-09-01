import type { IPublicPlugin, IPublicPluginContext } from '@etfma/core';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import AppLogo from './index.vue';
import { LayoutType } from '@etfma/types';

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
        contentProps: {
          isBorder: false,
        },
      });

      skeleton.add({
        name: 'PluginAsideAppLogo',
        area: 'aside',
        props: {
          align: 'left',
        },
        visible: false,
        content: h(AppLogo),
        contentProps: {
          isBorder: false,
          layout: 'side-nav',
        },
      });

      skeleton.add({
        name: 'PluginMixAppLogo',
        area: 'aside',
        props: {
          align: 'left',
        },
        visible: false,
        content: h(AppLogo),
        contentProps: {
          isBorder: false,
          isTitle: false,
          layout: 'side-mixed-nav',
        },
      });

      config.onGot('layout', (l: LayoutType) => {
        if (l === 'side-mixed-nav') {
          skeleton.showWidget('PluginMixAppLogo');
          skeleton.hideWidget('PluginAsideAppLogo');
          skeleton.hideWidget('PluginHeaderAppLogo');
        } else if (l === 'header-nav' || l === 'mixed-nav') {
          skeleton.hideWidget('PluginMixAppLogo');
          skeleton.hideWidget('PluginAsideAppLogo');
          skeleton.showWidget('PluginHeaderAppLogo');
        } else {
          skeleton.hideWidget('PluginHeaderAppLogo');
          skeleton.hideWidget('PluginMixAppLogo');
          skeleton.showWidget('PluginAsideAppLogo');
        }
      });
    },
  };
};

PluginAppLogo.pluginName = 'PluginAppLogo';

export default PluginAppLogo;
