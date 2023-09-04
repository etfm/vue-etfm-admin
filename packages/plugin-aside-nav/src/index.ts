import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import AsideNav from './aside.vue';
import AsideNavLogo from './logo.vue';

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

      skeleton.add({
        name: 'PluginAsideNavLogo',
        area: 'aside',
        props: {
          align: 'left',
        },
        content: h(AsideNavLogo),
        contentProps: {
          title: opts.title,
          image: opts.image,
        },
      });

      config.onGot('layout', (l: LayoutType) => {
        if (l === 'side-nav') {
          skeleton.showWidget('PluginAsideNav');
          skeleton.showWidget('PluginAsideNavLogo');
        } else {
          skeleton.hideWidget('PluginAsideNav');
          skeleton.hideWidget('PluginAsideNavLogo');
        }
      });
    },
  };
};

PluginAsideNav.pluginName = 'PluginAsideNav';

export default PluginAsideNav;

export { AsideNav, PluginAsideNav };
