<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { usePlacesStore } from '@/stores/places.store';
import { useMoviesStore } from '@/stores/movies.store';
import { useEventsStore } from '@/stores/events.store';
import AppButton from '@/components/AppButton.vue';
import PlaceCard from '@/components/PlaceCard.vue';
import MovieCard from '@/components/MovieCard.vue';
import EventCard from '@/components/EventCard.vue';

const authStore  = useAuthStore();
const placesStore = usePlacesStore();
const moviesStore = useMoviesStore();
const eventsStore = useEventsStore();
const searchQuery = ref('');

function search() {
  placesStore.setFilter('search', searchQuery.value);
}

// Apagar o texto sem apertar Enter precisa limpar o filtro também,
// senão os resultados ficam presos numa busca que não está mais visível.
watch(searchQuery, (val) => {
  if (val === '' && placesStore.filters.search !== '') {
    placesStore.setFilter('search', '');
  }
});

// "Em cartaz" só faz sentido enquanto o filtro ativo é Cinema (ver AppNav cat-bar).
watch(() => placesStore.filters.category, (category) => {
  if (category === 'CINEMA' && !moviesStore.items.length) {
    moviesStore.fetchNowPlaying();
  }
}, { immediate: true });

onMounted(() => {
  placesStore.fetchPlaces(true);
  eventsStore.fetchHighlights();
});
</script>

<template>
  <div class="home-container">
    <section class="hero">
      <h1>Descubra o melhor em <span>Campinas</span></h1>
      <p>Encontre parques, museus, teatros e eventos em um só lugar.</p>

      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          class="input-base"
          placeholder="O que você está procurando hoje?"
          @keydown.enter="search"
        />
        <AppButton @click="search">Buscar</AppButton>
      </div>
    </section>

    <section class="grid-section">
      <div v-if="authStore.isAuth" class="section-header">
        <span>Especiais para você, {{ authStore.user?.firstName }}</span>
      </div>

      <div v-if="placesStore.loading && !placesStore.items.length" class="status-text">Carregando...</div>
      <div v-else-if="!placesStore.items.length" class="status-text">Nenhum local encontrado.</div>
      <template v-else>
        <div class="cards-grid">
          <PlaceCard v-for="place in placesStore.items" :key="place.id" :place="place" />
        </div>
        <div v-if="placesStore.hasMore" class="load-more">
          <AppButton variant="ghost" :loading="placesStore.loading" @click="placesStore.nextPage">
            Carregar mais
          </AppButton>
        </div>
      </template>
    </section>

    <section class="grid-section" v-if="eventsStore.highlights.length">
      <div class="section-header">
        <h2>Próximos eventos</h2>
      </div>
      <div class="cards-grid">
        <EventCard v-for="event in eventsStore.highlights" :key="event.id" :event="event" />
      </div>
    </section>

    <section class="grid-section" v-if="placesStore.filters.category === 'CINEMA' && (moviesStore.loading || moviesStore.items.length)">
      <div class="section-header">
        <h2>Em cartaz no cinema</h2>
      </div>

      <div v-if="moviesStore.loading" class="status-text">Carregando...</div>
      <div v-else class="movies-row">
        <MovieCard v-for="movie in moviesStore.items" :key="movie.id" :movie="movie" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 60px 0;
}
.hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
.hero h1 span { color: var(--purple); }

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 30px auto;
  gap: 10px;
}
.search-bar input {
  flex: 1;
}

.section-header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
.section-header span { color: var(--text2); font-size: 14px; }

.status-text { padding: 60px 20px; text-align: center; color: var(--text3); }

.cards-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 30px; }
@media(max-width:1100px){ .cards-grid { grid-template-columns: repeat(3,1fr); } }
@media(max-width:780px) { .cards-grid { grid-template-columns: repeat(2,1fr); } }

.load-more { display: flex; justify-content: center; margin-top: 30px; }

.movies-row {
  display: flex; gap: 16px; margin-top: 30px;
  overflow-x: auto; scrollbar-width: none; padding-bottom: 4px;
}
</style>
