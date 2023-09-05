import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfm/types';
import { lodash } from '@etfm/shared';
import { skeleton, config } from 'etfm-engine';
import { h } from 'vue';
import MixedNavAside from './aside.vue';
import MixedNavHeader from './header.vue';
import MixedNavLogo from './logo.vue';

const PluginMixedNav: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(context, options);

      skeleton.add({
        name: 'PluginMixedNavAside',
        area: 'aside',
        content: h(MixedNavAside),
        contentProps: opts,
      });

      skeleton.add({
        name: 'PluginMixedNavHeader',
        area: 'header',
        content: h(MixedNavHeader),
        contentProps: opts,
      });

      skeleton.add({
        name: 'PluginMixedNavLogo',
        area: 'header',
        props: {
          align: 'left',
        },
        content: h(MixedNavLogo),
        contentProps: opts,
      });

      config.onGot('layout', (l: LayoutType) => {
        if (l === 'mixed-nav') {
          skeleton.showWidget('PluginMixedNavAside');
          skeleton.showWidget('PluginMixedNavHeader');
          skeleton.showWidget('PluginMixedNavLogo');
        } else {
          skeleton.hideWidget('PluginMixedNavAside');
          skeleton.hideWidget('PluginMixedNavHeader');
          skeleton.hideWidget('PluginMixedNavLogo');
        }
      });
    },
  };
};

PluginMixedNav.pluginName = 'PluginMixedNav';

export default PluginMixedNav;

export { MixedNavHeader, MixedNavAside, MixedNavLogo, PluginMixedNav };
