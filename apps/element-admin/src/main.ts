import '@etfma/design';
import 'uno.css';

import { plugins, init, skeleton } from '@etfma/core';
import type { IPublicPluginContext, IPublicPlugin } from '@etfma/core';
// import Analysis from '@/views/dashboard/analysis/index.vue';
import { h } from 'vue';
import PluginHttp from '@etfma/plugin-http';
import { handleHttpError } from './http/error';
import { Recordable } from '@etfma/types';
import { getToken } from './cache/auth';
import { getAppEnvConfig } from '@etfma/shared';
import PluginPinia from '@etfma/plugin-pinia';
import PluginDesigner from '@etfma/plugin-designer';
import PluginAside from '@etfma/plugin-aside';
import { staticRoutes } from './router';
import PluginRouterGuard from './plugin/router-guard';
import PluginLocale from './plugin/plugin-locale';
import PluginAppLogo from './plugin/plugin-logo';
import PluginTabs from '@etfma/plugin-tabs';
import PluginBreadcrumb from '@etfma/plugin-breadcrumb';

async function boostrap() {
  const AppConfig = getAppEnvConfig();

  await plugins.register(
    PluginHttp,
    {
      apiUrl: AppConfig.VITE_GLOB_API_URL,
      urlPrefix: AppConfig.VITE_GLOB_API_URL_PREFIX,
      requestInterceptors: [
        (config) => {
          // 请求之前处理config
          const token = getToken();
          if (token && (config as Recordable<any>)?.requestOptions?.withToken !== false) {
            // jwt token
            (config as Recordable<any>).headers.Authorization = token;
          }
          return config;
        },
      ],
      onError: handleHttpError,
    },
    { autoInit: true },
  );

  await plugins.register(PluginLocale);

  await plugins.register(PluginPinia);

  await plugins.register(PluginAside);
  await plugins.register(PluginAppLogo);
  await plugins.register(PluginTabs);

  const buildSkeleton: IPublicPlugin = (_: IPublicPluginContext) => {
    return {
      name: 'TextPlugin',
      init() {
        skeleton.add({
          area: 'footer',
          name: 'bottomArea',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'float',
          name: 'leftFixedArea',
          content: h('div', 'logologologologologologologologologol'),
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
          props: {
            enableDrag: true,
          },
        });
      },
    };
  };

  buildSkeleton.pluginName = 'TextPlugin';

  await plugins.register(buildSkeleton);

  await plugins.register(PluginDesigner);

  await plugins.register(PluginBreadcrumb);

  await plugins.register(PluginRouterGuard);

  await init(document.getElementById('app')!, {
    router: {
      routes: staticRoutes,
    },
  });
}

boostrap();
