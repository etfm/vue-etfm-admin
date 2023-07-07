import '@etfma/design';
import 'uno.css';

import { plugins, init, skeleton } from '@etfma/core';
import type { IPublicPluginContext, IPublicPlugin } from '@etfma/core';
// import Analysis from '@/views/dashboard/analysis/index.vue';
import { h } from 'vue';
import LayoutSider from '@/layouts/sider/layout-sider.vue';
import PluginHttp from '@etfma/plugin-http';
import { handleHttpError } from './http/error';
import { Recordable } from '@etfma/types';
import { getToken } from './cache/auth';
import { getAppEnvConfig } from '@etfma/shared';
import PluginPinia from '@etfma/plugin-pinia';
import PluginDesigner from '@etfma/plugin-designer';

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

  await plugins.register(PluginPinia);

  const buildSkeleton: IPublicPlugin = (_: IPublicPluginContext) => {
    return {
      name: 'TextPlugin',
      init() {
        skeleton.add({
          area: 'header',
          type: 'Widget',
          name: 'topArea',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'aside',
          type: 'Widget',
          name: 'leftArea',
          content: h(LayoutSider, {
            isCollapse: false,
            layout: 'side-nav',
          }),
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'footer',
          type: 'Widget',
          name: 'bottomArea',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'toolbar',
          type: 'Widget',
          name: 'toolbar',
          content: 'logo',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'breadcrumb',
          type: 'Widget',
          name: 'toolbarTop',
          content: '1212',
          contentProps: {
            logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
            href: 'https://lowcode-engine.cn',
          },
        });

        skeleton.add({
          area: 'float',
          type: 'Widget',
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

  await init(document.getElementById('app')!, {
    router: {
      routes: [
        {
          path: '/',
          name: 'Analysis',
          component: () => import('./views/dashboard/analysis/index.vue'),
          meta: {
            title: 'routes.dashboard.analysis',
            currentActiveMenu: '/dashboard/analysis',
          },
        },
      ],
    },
  });
}

boostrap();
