import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import { lodash } from '@etfma/shared';
import Breadcrumb from './index.vue';

const PluginBreadcrumb: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginBreadcrumb',
        area: 'header',
        content: h(Breadcrumb),
        contentProps: opts,
      });
    },
  };
};

PluginBreadcrumb.pluginName = 'PluginBreadcrumb';

export default PluginBreadcrumb;
