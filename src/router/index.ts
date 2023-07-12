import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { auth } from "@/pocketbase"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/group/:id',
      name: 'group',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/GroupView.vue')
    },
    {
      path: '/login',
      name: 'about',
      component: () => import('@/views/LoginView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {

  if (to.meta.requiresAuth == true && !auth.user) {
    next("/login")
  } else if (to.path == "/login" && auth.user) {
    next("/")
  }

  next()

})

export default router
