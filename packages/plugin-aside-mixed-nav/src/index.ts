import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import AsideMixedNavAside from './aside.vue';
import AsideMixedNavExtra from './extra.vue';

const PluginAsideMixedNav: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(context, options);

      skeleton.add({
        name: 'PlugiAsideMixedNavAside',
        area: 'aside',
        content: h(AsideMixedNavAside),
        contentProps: opts,
      });

      skeleton.add({
        name: 'PlugiAsideMixedNavExtra',
        area: 'extra',
        content: h(AsideMixedNavExtra),
        contentProps: opts,
      });

      config.onGot('layout', (l: LayoutType) => {
        if (l === 'side-mixed-nav') {
          skeleton.showWidget('PlugiAsideMixedNavAside');
          skeleton.showWidget('PlugiAsideMixedNavExtra');
        } else {
          skeleton.hideWidget('PlugiAsideMixedNavAside');
          skeleton.hideWidget('PlugiAsideMixedNavExtra');
        }
      });
    },
  };
};

PluginAsideMixedNav.pluginName = 'PluginAsideMixedNav';

export default PluginAsideMixedNav;

export { AsideMixedNavAside, AsideMixedNavExtra, PluginAsideMixedNav };
