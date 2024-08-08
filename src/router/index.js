import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/login.vue'
import Tab from '../views/auth/tab.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/category',
    name: 'category',
    component: Tab
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
