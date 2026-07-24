import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export interface AteneuEvent {
  id: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  endDate?: string;
  address?: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  isFree: boolean;
  price?: number;
  priceLabel?: string;
  ticketUrl?: string;
  place?: { id: string; name: string; address: string; lat: number; lng: number };
}

export interface EventFilters {
  search:   string;
  category: string;
  date:     string;
  isFree:   boolean | null;
  page:     number;
  limit:    number;
}

export const useEventsStore = defineStore('events', () => {
  const items   = ref<AteneuEvent[]>([]);
  const total   = ref(0);
  const pages   = ref(1);
  const loading = ref(false);
  const error   = ref<string | null>(null);

  const filters = ref<EventFilters>({
    search: '', category: '', date: '', isFree: null, page: 1, limit: 20,
  });

  const hasMore = computed(() => filters.value.page < pages.value);

  // Group events by date for calendar view
  const byDate = computed(() => {
    const map: Record<string, AteneuEvent[]> = {};
    for (const ev of items.value) {
      const d = ev.date.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(ev);
    }
    return map;
  });

  async function fetchEvents(reset = false) {
    if (reset) { filters.value.page = 1; items.value = []; }
    loading.value = true;
    error.value   = null;
    try {
      const params: Record<string, unknown> = {
        page:  filters.value.page,
        limit: filters.value.limit,
        upcoming: 'true',
      };
      if (filters.value.search)   params.search   = filters.value.search;
      if (filters.value.category) params.category = filters.value.category;
      if (filters.value.date)     params.date     = filters.value.date;
      if (filters.value.isFree !== null) params.isFree = filters.value.isFree;

      const { data } = await api.get('/events', { params });
      if (reset) {
        items.value = data.data;
      } else {
        items.value.push(...data.data);
      }
      total.value = data.total;
      pages.value = data.pages;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar eventos.';
    } finally {
      loading.value = false;
    }
  }

  function setFilter<K extends keyof EventFilters>(key: K, value: EventFilters[K]) {
    filters.value[key] = value;
    fetchEvents(true);
  }

  function selectDate(date: string) {
    setFilter('date', filters.value.date === date ? '' : date);
  }

  return { items, total, pages, loading, error, filters, hasMore, byDate, fetchEvents, setFilter, selectDate };
});
