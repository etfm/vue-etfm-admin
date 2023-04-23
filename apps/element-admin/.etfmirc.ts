import { defineApp } from '@etfm/vea-plugin';
import { staticRoutes } from './src/router';
import { getAppEnvConfig, getStorageShortName } from '@etfm/vea-shared';
import { handleHttpError } from '@/http/error';
import { setupRouterGuard } from '@/router/guard';

const AppConfig = getAppEnvConfig();

/**
 * 运行时配置
 */
export default defineApp({
  render: {
    onMounted: async ({ router }) => {
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
    // 自定义请求错误
    onError: handleHttpError,
  },
});
