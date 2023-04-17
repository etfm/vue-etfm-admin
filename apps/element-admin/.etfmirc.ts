import { defineApp } from '@etfm/vea-plugin'
import { basicRoutes } from './src/router'
import { getStorageShortName } from '@etfm/vea-shared'

/**
 * 运行时配置
 */
export default defineApp({
  render: {
    onMounted({ router }) {
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
  }
})
