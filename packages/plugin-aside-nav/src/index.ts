import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import AsideNav from './aside.vue';

const PluginAsideNav: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(context, options);

      skeleton.add({
        name: 'PluginAsideNav',
        area: 'aside',
        content: h(AsideNav),
        contentProps: opts,
      });

      config.onGot('layout', (l: LayoutType) => {
        if (l === 'side-nav') {
          skeleton.showWidget('PluginAsideNav');
        } else {
          skeleton.hideWidget('PluginAsideNav');
        }
      });
    },
  };
};

PluginAsideNav.pluginName = 'PluginAsideNav';

export default PluginAsideNav;

export { AsideNav, PluginAsideNav };
