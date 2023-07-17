import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { lodash } from '@etfma/shared';
import { BasicMenu } from '@etfma/bs-ui';
import { skeleton } from '@etfma/core';
import { h } from 'vue';

const PluginAside: IPublicPlugin = (ctx: IPublicPluginContext, options: IPiniaContext) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginAside',
        area: 'aside',
        content: h(BasicMenu),
        contentProps: opts,
      });
    },
  };
};

PluginAside.pluginName = 'PluginAside';

export default PluginAside;
