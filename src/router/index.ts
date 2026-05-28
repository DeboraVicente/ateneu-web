import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/agenda',
      component: () => import('@/views/CalendarView.vue'),
    },
    {
      path: '/eventos/:id',
      component: () => import('@/views/EventDetailView.vue'),
    },
    {
      path: '/busca',
      component: () => import('@/views/SearchView.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/cadastro',
      component: () => import('@/views/RegisterView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
