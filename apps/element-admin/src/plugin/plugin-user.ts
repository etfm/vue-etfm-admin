import type { IPublicPlugin, IPublicPluginContext } from '@etfma/core';
import { skeleton } from '@etfma/core';
import { h } from 'vue';
import AppLogo from '@/layouts/components/logo/AppLogo.vue';

/**
 * 设置用户信息等
 * @param _
 * @returns
 */
const PluginUser: IPublicPlugin = (_: IPublicPluginContext) => {
  return {
    init() {
      skeleton.add({
        name: 'PluginUser',
        area: 'header',
        props: {
          align: 'right',
        },
        content: h(AppLogo),
      });
    },
  };
};

PluginUser.pluginName = 'PluginUser';

export default PluginUser;
