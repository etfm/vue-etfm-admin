import { defineApp } from '@etfma/plugin';
import { staticRoutes } from './src/router';
import { getAppEnvConfig, getStorageShortName } from '@etfma/shared';
import { handleHttpError } from '@/http/error';
import { setupRouterGuard } from '@/router/guard';
import { getToken } from '@/cache/auth';
import { Recordable } from '@etfma/types';

const AppConfig = getAppEnvConfig();

/**
 * 运行时配置
 */
export default defineApp({
  render: {
    onMounted: async ({ router, app }) => {
      console.log(app, '=======');

      // 路由拦截
      setupRouterGuard(router);
    },
  },
  router: {
    routes: staticRoutes,
  },
  pinia: {
    key: getStorageShortName(),
  },
  http: {
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
    // 自定义请求错误
    onError: handleHttpError,
  },
});
