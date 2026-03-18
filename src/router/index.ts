import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from '@/modules/auth/views/AuthPage.vue';

const routes = [
  { path: '/auth', name: 'auth', component: AuthPage },
  { path: '/', redirect: '/auth' }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});