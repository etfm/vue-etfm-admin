import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfm/types';
import { skeleton } from 'etfm-engine';
import { h } from 'vue';
import { lodash } from '@etfm/shared';
import Setting from './index.vue';

export interface Props {
  title?: string;
}

const PluginSetting: IPublicPlugin = (ctx: IPublicPluginContext, options) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge(config, options);

      skeleton.add({
        name: 'PluginSetting',
        area: 'header',
        props: {
          align: 'right',
        },
        content: h(Setting),
        contentProps: opts,
      });
    },
  };
};

PluginSetting.pluginName = 'PluginSetting';

export default PluginSetting;
