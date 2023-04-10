import type { App } from 'vue'
import { register as registerRouter, addRoutes } from '@etfm/vea-router'

export async function register(app: App) {
  registerRouter(app, {
    routers: [
      {
        path: '/',
        name: 'layout',
        component: 'layout-entry',
        meta: {
          title: '登录'
        },
        children: [
          {
            path: 'layout-out',
            name: 'layout-out',
            component: 'layout-entry',
            meta: {
              title: '登录'
            },
            children: [
              {
                path: 'logo',
                name: 'logo',
                component: 'logo/logo-view',
                meta: {
                  title: '登录'
                },
                children: []
              }
            ]
          }
        ]
      }
    ],
    beforePatchRoutes: (routes) => {},
    onMounted: ({ app, router, routes }) => {
      router.beforeEach(() => {})

      addRoutes([
        {
          path: '/aa',
          name: 'layout0',
          component: 'layout-entry',
          meta: {
            title: '登录'
          },
          children: []
        }
      ])
    }
  })
}
