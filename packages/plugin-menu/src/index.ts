import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import { lodash } from '@etfma/shared';
import Sider from './sider.vue';

const PluginMenu: IPublicPlugin = (ctx: IPublicPluginContext, options: IPiniaContext) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginMenu',
        area: 'aside',
        content: h(Sider),
        contentProps: opts,
      });
    },
  };
};

PluginMenu.pluginName = 'PluginMenu';

export default PluginMenu;
