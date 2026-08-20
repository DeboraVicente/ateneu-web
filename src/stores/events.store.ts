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
  isFree:   boolean | null;
}

export const useEventsStore = defineStore('events', () => {
  // Todos os eventos que casam com os filtros (busca/categoria/gratuito) — sem
  // recorte por dia/mês, para alimentar o calendário inteiro de uma vez. Navegar
  // entre meses e clicar num dia filtra esse conjunto no cliente, sem novo fetch.
  const items = ref<AteneuEvent[]>([]);
  // "Destaques" da sidebar: os próximos eventos, independente do que está sendo
  // navegado no calendário (dia selecionado, mês, filtros) — busca própria e única.
  const highlights = ref<AteneuEvent[]>([]);

  const total   = ref(0);
  const loading = ref(false);
  const error   = ref<string | null>(null);

  const filters = ref<EventFilters>({ search: '', category: '', isFree: null });

  const byDate = computed(() => {
    const map: Record<string, AteneuEvent[]> = {};
    for (const ev of items.value) {
      const d = ev.date.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(ev);
    }
    return map;
  });

  async function fetchEvents() {
    loading.value = true;
    error.value   = null;
    try {
      const params: Record<string, unknown> = { page: 1, limit: 200, upcoming: 'false' };
      if (filters.value.search)   params.search   = filters.value.search;
      if (filters.value.category) params.category = filters.value.category;
      if (filters.value.isFree !== null) params.isFree = filters.value.isFree;

      const { data } = await api.get('/events', { params });
      items.value = data.data;
      total.value = data.total;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar eventos.';
    } finally {
      loading.value = false;
    }
  }

  async function fetchHighlights() {
    try {
      const { data } = await api.get('/events', { params: { page: 1, limit: 4, upcoming: 'true' } });
      highlights.value = data.data;
    } catch {
      // destaques são complementares — falha aqui não deve travar o calendário
    }
  }

  function setFilter<K extends keyof EventFilters>(key: K, value: EventFilters[K]) {
    filters.value[key] = value;
    fetchEvents();
  }

  return { items, highlights, total, loading, error, filters, byDate, fetchEvents, fetchHighlights, setFilter };
});
