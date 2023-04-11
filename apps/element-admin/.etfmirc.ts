export default {
  router: {
    routes: [
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
            }
          }
        ]
      }
    ]
  }
}
