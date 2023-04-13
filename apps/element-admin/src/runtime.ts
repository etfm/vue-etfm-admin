import { defineApp } from '@etfm/vea-plugin'

import '@etfm/vea-render'
import 'uno.css'
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
/**
 * 运行时配置
 */
export default defineApp({
  router: {},
  onAppCreated: () => {
    console.log('onAppCreated')
    return { aaa: '111' }
  },
  onMounted({ router }) {
    router?.beforeEach((to, from, next) => {
      console.log(to, from)

      next()
    })
  }
})
