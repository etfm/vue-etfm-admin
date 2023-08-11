import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { skeleton, config } from '@etfma/core';
import { h } from 'vue';
import Aside from './index.vue';
import { useTheme } from './theme';

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

      config.onGot('layout', (l: string) => {
        if (l === 'aside' || l === 'mix') {
          skeleton.showArea('aside');
        } else {
          skeleton.hideArea('aside');
        }
      });

      useTheme();
    },
  };
};

PluginAside.pluginName = 'PluginAside';

export default PluginAside;
