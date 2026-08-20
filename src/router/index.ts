import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import HomeView from '@/views/HomeView.vue';
import CalendarView from '@/views/CalendarView.vue';
import MapView from '@/views/MapView.vue';
import EventDetailView from '@/views/EventDetailView.vue';
import PlaceDetailView from '@/views/PlaceDetailView.vue';
import FavoritesView from '@/views/FavoritesView.vue';
import AuthView from '@/views/AuthView.vue';
import TermsView from '@/views/TermsView.vue';
import PrivacyView from '@/views/PrivacyView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/mapa', name: 'map', component: MapView },
  { path: '/calendario', name: 'calendar', component: CalendarView },
  { path: '/evento/:id', name: 'event-detail', component: EventDetailView },
  { path: '/local/:id', name: 'place-detail', component: PlaceDetailView },
  { path: '/favoritos', name: 'favorites', component: FavoritesView, meta: { requiresAuth: true } },
  { path: '/auth', name: 'auth', component: AuthView },
  { path: '/termos', name: 'terms', component: TermsView },
  { path: '/privacidade', name: 'privacy', component: PrivacyView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore();
    if (!auth.isAuth) {
      return { name: 'auth', query: { redirect: to.fullPath } };
    }
  }
});
