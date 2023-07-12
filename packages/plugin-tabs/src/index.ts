import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import { lodash } from '@etfma/shared';
import Tabs from './index.vue';

const PluginTabs: IPublicPlugin = (ctx: IPublicPluginContext, options: IPiniaContext) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginTabs',
        area: 'toolbar',
        content: h(Tabs),
        contentProps: opts,
      });
    },
  };
};

PluginTabs.pluginName = 'PluginTabs';

export default PluginTabs;
