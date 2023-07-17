import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import Aside from './index.vue';

const PluginAside: IPublicPlugin = (ctx: IPublicPluginContext, options: IPiniaContext) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginAside',
        area: 'aside',
        content: h(Aside),
        contentProps: opts,
      });
    },
  };
};

PluginAside.pluginName = 'PluginAside';

export default PluginAside;
