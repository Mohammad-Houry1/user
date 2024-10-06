import { createRouter, createWebHistory } from 'vue-router'
import user from '../component/user.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: user
    }
  ]
})

export default router
