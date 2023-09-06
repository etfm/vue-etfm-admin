import 'uno.css';
import './styles/common.scss';
import 'element-plus/theme-chalk/dark/css-vars.css';

import { plugins, init } from 'etfm-engine';
import PluginHttp from '@etfma/plugin-http';
import { handleHttpError } from './http/error';
import { Recordable } from '@etfm/types';
import { getToken } from './cache/auth';
import PluginPinia from '@etfma/plugin-pinia';
import PluginDesigner from '@etfma/plugin-designer';
import { staticRoutes } from './router';
import PluginUser from './plugin/plugin-user';
import PluginInit from './plugin/plugin-init';
import PluginSetting from '@etfma/plugin-setting';
import { getAppEnvConfig } from './utils/env';
import { transformObjToRoute } from './router/helper/routerHelper';
import { PluginLayoutPreset } from '@etfm/plugin-layout-preset';

import logo from '@/assets/images/logo.png';

async function boostrap() {
  const AppConfig = getAppEnvConfig();

  await plugins.register(PluginHttp, {
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
  });

  await plugins.register(PluginInit);

  await plugins.register(PluginPinia);

  await plugins.register(PluginLayoutPreset, {}, { preset: true });

  await plugins.register(PluginDesigner);

  await plugins.register(PluginUser);

  await plugins.register(PluginSetting);

  const routes = transformObjToRoute(staticRoutes);

  const preference = new Map();

  preference.set('PluginLayoutPreset', {
    uniqueOpened: true,
    title: 'Etfm Admin',
    image: logo,
  });

  await init(
    document.getElementById('app')!,
    {
      router: {
        routes,
      },
    },
    preference,
  );
}

boostrap();
