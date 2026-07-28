import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  releaseDate: string;
  voteAverage: number;
}

export const useMoviesStore = defineStore('movies', () => {
  const items   = ref<Movie[]>([]);
  const loading = ref(false);
  const error   = ref<string | null>(null);

  async function fetchNowPlaying() {
    loading.value = true;
    error.value   = null;
    try {
      const { data } = await api.get('/movies/now-playing');
      items.value = data.data;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar filmes em cartaz.';
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, error, fetchNowPlaying };
});
