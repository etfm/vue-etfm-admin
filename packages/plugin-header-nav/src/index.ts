import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfm/types';
import { lodash } from '@etfm/shared';
import HeaderNav from './index.vue';
import { skeleton, config } from 'etfm-engine';
import { h } from 'vue';
import HeaderNavLogo from './logo.vue';
import { MenuModeEnum } from '@etfm/element-ui';

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

      skeleton.add({
        name: 'PluginHeaderNavLogo',
        area: 'header',
        props: {
          align: 'left',
        },
        content: h(HeaderNavLogo),
        contentProps: opts,
      });

      config.onGot('layout', (layout: LayoutType) => {
        if (layout === 'header-nav') {
          skeleton.showWidget('PluginHeaderNav');
          skeleton.showWidget('PluginHeaderNavLogo');
        } else {
          skeleton.hideWidget('PluginHeaderNav');
          skeleton.hideWidget('PluginHeaderNavLogo');
        }
      });
    },
  };
};

PluginHeaderNav.pluginName = 'PluginHeaderNav';

export default PluginHeaderNav;

export { HeaderNav, HeaderNavLogo, PluginHeaderNav };
