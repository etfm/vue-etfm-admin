import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import { lodash } from '@etfma/shared';
import Fullscreen from './index.vue';

const PluginBreadcrumbFullscreen: IPublicPlugin = (
  ctx: IPublicPluginContext,
  options: IPiniaContext,
) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginBreadcrumbFullscreen',
        area: 'toolbar',
        content: h(Fullscreen),
        contentProps: opts,
        props: {
          align: 'right',
        },
      });
    },
  };
};

PluginBreadcrumbFullscreen.pluginName = 'PluginBreadcrumbFullscreen';

export default PluginBreadcrumbFullscreen;
