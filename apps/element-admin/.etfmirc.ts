import { defineApp } from '@etfm/vea-plugin'
import { basicRoutes } from './src/router'
import { getAppEnvConfig, getStorageShortName } from '@etfm/vea-shared'
import { getMenuList } from '@/api/sys/menu'

const AppConfig = getAppEnvConfig()
console.log(AppConfig)

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
    responseInterceptors: [
      [
        (config) => {
          const { data } = config
          // throw new Error('请求失败')
          if (!data) {
            // return '[HTTP] Request has no return value';
            throw new Error('请求失败')
          }

          const { code, result, message } = data as any

          const hasSuccess = data && Reflect.has(data, 'code') && code === 0
          return config
          if (hasSuccess) {
            return result
          }
        }
      ]
    ],
    errorConfig: {
      errorThrower() {
        console.log('------------------')
      },
      errorHandler(e) {
        console.log('================111', e, e.info, e.message)
      }
    }
  }
})
