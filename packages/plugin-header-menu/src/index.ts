import { IPiniaContext, IPublicPlugin, IPublicPluginContext } from '@etfma/types';
import { lodash } from '@etfma/shared';
import Menu from './index.vue';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import { MenuModeEnum } from '@etfma/bs-ui';

const PluginHeaderMenu: IPublicPlugin = (ctx: IPublicPluginContext, options: IPiniaContext) => {
  return {
    init: () => {
      const config = ctx.preference.getPreference() as unknown as IPiniaContext;
      const opts = lodash.merge({ mode: MenuModeEnum.HORIZONTAL }, config, options);

      skeleton.add({
        name: 'PluginHeaderMenu',
        area: 'header',
        content: h(Menu),
        contentProps: opts,
      });
    },
  };
};

PluginHeaderMenu.pluginName = 'PluginHeaderMenu';

export default PluginHeaderMenu;
