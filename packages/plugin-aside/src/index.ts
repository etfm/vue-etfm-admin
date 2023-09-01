import { IPiniaContext, IPublicPlugin, IPublicPluginContext, LayoutType } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import Aside from './aside.vue';
import MixAside from './mix-aside.vue';

const PluginAside: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const context = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(context, options);

      skeleton.add({
        name: 'PluginAside',
        area: 'aside',
        content: h(Aside),
        contentProps: opts,
      });

      skeleton.add({
        name: 'PluginMixAside',
        area: 'aside',
        content: h(MixAside),
        contentProps: opts,
        visible: false,
      });

      config.onGot('layout', (l: LayoutType) => {
        if (l === 'side-mixed-nav') {
          skeleton.showWidget('PluginMixAside');
          skeleton.hideWidget('PluginAside');
        } else {
          skeleton.showWidget('PluginAside');
          skeleton.hideWidget('PluginMixAside');
        }
      });
    },
  };
};

PluginAside.pluginName = 'PluginAside';

export default PluginAside;
