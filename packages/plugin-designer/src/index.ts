import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import { lodash } from '@etfma/shared';
import LayoutContent from './layout-content.vue';

const PluginDesigner: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginDesigner',
        area: 'main',
        type: 'Widget',
        content: h(LayoutContent),
        contentProps: opts,
      });
    },
  };
};

PluginDesigner.pluginName = 'PluginDesigner';

export default PluginDesigner;
