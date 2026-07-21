import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';
import { useAuthStore } from './auth.store';
import type { Place } from './places.store';
import type { AteneuEvent } from './events.store';

export interface Favorite {
  id: string;
  placeId?: string;
  eventId?: string;
  place?: Place;
  event?: AteneuEvent;
}

export const useFavoritesStore = defineStore('favorites', () => {
  const items   = ref<Favorite[]>([]);
  const loading = ref(false);

  const placeIds = computed(() => new Set(items.value.map(f => f.placeId).filter(Boolean)));
  const eventIds = computed(() => new Set(items.value.map(f => f.eventId).filter(Boolean)));

  function isFaved(placeId?: string, eventId?: string) {
    if (placeId) return placeIds.value.has(placeId);
    if (eventId) return eventIds.value.has(eventId);
    return false;
  }

  async function fetchFavorites() {
    const auth = useAuthStore();
    if (!auth.isAuth) return;
    try {
      const { data } = await api.get('/favorites');
      items.value = data.data;
    } catch {}
  }

  async function toggle(placeId?: string, eventId?: string) {
    const auth = useAuthStore();
    if (!auth.isAuth) return false; // signal: needs login

    const already = isFaved(placeId, eventId);
    if (already) {
      // find the fav id
      const fav = items.value.find(f =>
        (placeId && f.placeId === placeId) ||
        (eventId && f.eventId === eventId)
      );
      if (!fav) return true;
      // optimistic remove
      items.value = items.value.filter(f => f.id !== fav.id);
      try {
        await api.delete(`/favorites/${fav.id}`);
      } catch {
        items.value.push(fav); // rollback
      }
    } else {
      // optimistic add
      const tmp = { id: 'tmp_' + Date.now(), placeId, eventId };
      items.value.push(tmp);
      try {
        const { data } = await api.post('/favorites', { placeId, eventId });
        // replace temp with real
        const idx = items.value.findIndex(f => f.id === tmp.id);
        if (idx !== -1) items.value[idx] = data.data;
      } catch {
        items.value = items.value.filter(f => f.id !== tmp.id); // rollback
      }
    }
    return true;
  }

  return { items, loading, placeIds, eventIds, isFaved, fetchFavorites, toggle };
});
