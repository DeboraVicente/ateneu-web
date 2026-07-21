import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export interface Place {
  id: string;
  name: string;
  description?: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  imageUrl?: string;
  isFree: boolean;
  priceLevel?: number;
  openingHours?: Record<string, string>;
  _count?: { favorites: number; reviews: number };
  distanceKm?: number;
}

export interface PlaceFilters {
  search:   string;
  category: string;
  isFree:   boolean | null;
  page:     number;
  limit:    number;
  lat?:     number;
  lng?:     number;
  radius?:  number;
}

export const usePlacesStore = defineStore('places', () => {
  const items   = ref<Place[]>([]);
  const total   = ref(0);
  const pages   = ref(1);
  const loading = ref(false);
  const error   = ref<string | null>(null);

  const filters = ref<PlaceFilters>({
    search: '', category: '', isFree: null, page: 1, limit: 20,
  });

  const hasMore = computed(() => filters.value.page < pages.value);

  async function fetchPlaces(reset = false) {
    if (reset) { filters.value.page = 1; items.value = []; }
    loading.value = true;
    error.value   = null;
    try {
      const params: Record<string, unknown> = {
        page:  filters.value.page,
        limit: filters.value.limit,
      };
      if (filters.value.search)   params.search   = filters.value.search;
      if (filters.value.category) params.category = filters.value.category;
      if (filters.value.isFree !== null) params.isFree = filters.value.isFree;
      if (filters.value.lat)    params.lat    = filters.value.lat;
      if (filters.value.lng)    params.lng    = filters.value.lng;
      if (filters.value.radius) params.radius = filters.value.radius;

      const { data } = await api.get('/places', { params });
      if (reset) {
        items.value = data.data;
      } else {
        items.value.push(...data.data);
      }
      total.value = data.total;
      pages.value = data.pages;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar locais.';
    } finally {
      loading.value = false;
    }
  }

  function setFilter<K extends keyof PlaceFilters>(key: K, value: PlaceFilters[K]) {
    filters.value[key] = value;
    fetchPlaces(true);
  }

  function setNearby(lat: number, lng: number, radius?: number) {
    filters.value.lat = lat;
    filters.value.lng = lng;
    if (radius) filters.value.radius = radius;
    fetchPlaces(true);
  }

  function nextPage() {
    if (!hasMore.value || loading.value) return;
    filters.value.page++;
    fetchPlaces(false);
  }

  return { items, total, pages, loading, error, filters, hasMore, fetchPlaces, setFilter, setNearby, nextPage };
});
