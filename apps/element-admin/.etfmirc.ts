import { defineApp } from '@etfm/vea-plugin'
import { basicRoutes } from './src/router'

/**
 * 运行时配置
 */
export default defineApp({
  router: {
    routes: basicRoutes
  }
})
