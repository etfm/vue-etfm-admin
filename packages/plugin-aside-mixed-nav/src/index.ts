import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfm/types';
import { lodash } from '@etfm/shared';
import { skeleton, config } from 'etfm-engine';
import { h } from 'vue';
import AsideMixedNavAside from './aside.vue';
import AsideMixedNavExtra from './extra.vue';
import AsideMixedNavExtraHeader from './extra-header.vue';
import AsideMixedNavLogo from './logo.vue';

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

      skeleton.add({
        name: 'PluginAsideMixedNavExtraHeader',
        area: 'extra',
        props: {
          align: 'left',
        },
        content: h(AsideMixedNavExtraHeader),
        contentProps: {
          title: opts.title,
        },
      });

      skeleton.add({
        name: 'PluginAsideMixedNavLogo',
        area: 'aside',
        props: {
          align: 'left',
        },
        content: h(AsideMixedNavLogo),
        contentProps: opts,
      });

      config.onGot('layout', (l: LayoutType) => {
        if (l === 'side-mixed-nav') {
          skeleton.showWidget('PlugiAsideMixedNavAside');
          skeleton.showWidget('PlugiAsideMixedNavExtra');
          skeleton.showWidget('PluginAsideMixedNavExtraHeader');
          skeleton.showWidget('PluginAsideMixedNavLogo');
        } else {
          skeleton.hideWidget('PlugiAsideMixedNavAside');
          skeleton.hideWidget('PlugiAsideMixedNavExtra');
          skeleton.hideWidget('PluginAsideMixedNavExtraHeader');
          skeleton.hideWidget('PluginAsideMixedNavLogo');
        }
      });
    },
  };
};

PluginAsideMixedNav.pluginName = 'PluginAsideMixedNav';

export default PluginAsideMixedNav;

export {
  AsideMixedNavAside,
  AsideMixedNavExtra,
  AsideMixedNavExtraHeader,
  AsideMixedNavLogo,
  PluginAsideMixedNav,
};
