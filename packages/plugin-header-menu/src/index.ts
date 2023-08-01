import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { lodash } from '@etfma/shared';
import Menu from './index.vue';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import { MenuModeEnum } from '@etfma/bs-ui';

const PluginHeaderMenu: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge({ mode: MenuModeEnum.HORIZONTAL }, context, options);

      skeleton.add({
        name: 'PluginHeaderMenu',
        area: 'header',
        content: h(Menu),
        contentProps: opts,
        visible: opts.visible,
      });

      config.onGot('layout', (layout: string) => {
        if (layout === 'top' || layout === 'mix') {
          skeleton.showWidget('PluginHeaderMenu');
        } else {
          skeleton.hideWidget('PluginHeaderMenu');
        }
      });
    },
  };
};

PluginHeaderMenu.pluginName = 'PluginHeaderMenu';

export default PluginHeaderMenu;
