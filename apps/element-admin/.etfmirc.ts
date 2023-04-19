import { defineApp } from '@etfm/vea-plugin'
import { basicRoutes } from './src/router'
import { getAppEnvConfig, getStorageShortName } from '@etfm/vea-shared'
import { getMenuList } from '@/api/sys/menu'
import { handleHttpError } from '@/http/error'

const AppConfig = getAppEnvConfig()

/**
 * 运行时配置
 */
export default defineApp({
  render: {
    onMounted: async ({ router }) => {
      const aaa = await getMenuList()
      console.log(aaa)

      // 路由拦截
      router.beforeEach((to, from, next) => {
        console.log(to, from)
      })
    }
  },
  router: {
    routes: basicRoutes
  },
  pinia: {
    key: getStorageShortName()
  },
  http: {
    apiUrl: AppConfig.VITE_GLOB_API_URL,
    urlPrefix: AppConfig.VITE_GLOB_API_URL_PREFIX,
    // 自定义请求错误
    onError: handleHttpError
  }
})
