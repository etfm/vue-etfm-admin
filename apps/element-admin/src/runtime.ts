import { defineApp } from '@etfm/vea-plugin'

import '@etfm/vea-render'
import 'uno.css'

/**
 * 运行时配置
 */
export default defineApp({
  router: {},
  onAppCreated: () => {
    console.log('onAppCreated')
  },
  onMounted({ router }) {
    console.log(router, '----')

    router?.beforeEach((to, from, next) => {
      console.log(to, from)

      next()
    })
  }
})
