import { createRouter, createWebHistory } from 'vue-router'
import LayoutEntry from '../layouts/layout-entry.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: LayoutEntry
    }
  ]
})

export default router
