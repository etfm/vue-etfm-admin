import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { skeleton } from 'etfm-engine';
import { h } from 'vue';
import { lodash } from '@etfm/shared';
import ContentFullscreen from './index.vue';

const PluginContentFullscreen: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginContentFullscreen',
        area: 'toolbar',
        content: h(ContentFullscreen),
        contentProps: opts,
        props: {
          align: 'right',
        },
      });
    },
  };
};

PluginContentFullscreen.pluginName = 'PluginContentFullscreen';

export default PluginContentFullscreen;

export { ContentFullscreen, PluginContentFullscreen };
