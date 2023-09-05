import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { skeleton } from 'etfm-engine';
import { h } from 'vue';
import { lodash } from '@etfm/shared';
import Tabs from './index.vue';

const PluginTabs: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
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

export { PluginTabs, Tabs };
