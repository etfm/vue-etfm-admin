import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { skeleton } from 'etfm-engine';
import { h } from 'vue';
import { lodash } from '@etfm/shared';
import Fullscreen from './index.vue';

const PluginFullscreen: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginFullscreen',
        area: 'header',
        props: {
          align: 'right',
        },
        content: h(Fullscreen),
        contentProps: opts,
      });
    },
  };
};

PluginFullscreen.pluginName = 'PluginFullscreen';

export default PluginFullscreen;

export { PluginFullscreen, Fullscreen };
