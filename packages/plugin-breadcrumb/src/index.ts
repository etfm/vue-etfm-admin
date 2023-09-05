import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { skeleton } from 'etfm-engine';
import { h } from 'vue';
import { lodash } from '@etfm/shared';
import Breadcrumb from './index.vue';

const PluginBreadcrumb: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginBreadcrumb',
        area: 'breadcrumb',
        content: h(Breadcrumb),
        contentProps: opts,
      });
    },
  };
};

PluginBreadcrumb.pluginName = 'PluginBreadcrumb';

export default PluginBreadcrumb;
