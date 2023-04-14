import { defineApp } from '@etfm/vea-plugin'
import { basicRoutes } from './src/router'
import { getStorageShortName } from '@etfm/vea-shared'

/**
 * 运行时配置
 */
export default defineApp({
  router: {
    routes: basicRoutes
  },
  pinia: {
    key: getStorageShortName()
  }
})
