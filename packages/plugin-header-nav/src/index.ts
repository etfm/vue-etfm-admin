import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfma/types';
import { lodash } from '@etfma/shared';
import HeaderNav from './index.vue';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import { MenuModeEnum } from '@etfma/bs-ui';

const PluginHeaderNav: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(context, options, { mode: MenuModeEnum.HORIZONTAL });

      skeleton.add({
        name: 'PluginHeaderNav',
        area: 'header',
        content: h(HeaderNav),
        contentProps: opts,
      });

      config.onGot('layout', (layout: LayoutType) => {
        if (layout === 'header-nav') {
          skeleton.showWidget('PluginHeaderNav');
        } else {
          skeleton.hideWidget('PluginHeaderNav');
        }
      });
    },
  };
};

PluginHeaderNav.pluginName = 'PluginHeaderNav';

export default PluginHeaderNav;

export { HeaderNav, PluginHeaderNav };
