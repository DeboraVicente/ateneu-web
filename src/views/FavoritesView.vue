<!-- src/views/FavoritesView.vue -->
<template>
  <main class="page-main">
    <div class="page-header">
      <h1 class="page-title">Meus Favoritos</h1>
      <span class="page-sub">{{ favs.items.length }} item{{ favs.items.length !== 1 ? 's' : '' }} salvos</span>
    </div>

    <!-- Tabs -->
    <div class="fav-tabs">
      <button class="pill" :class="{ active: activeTab === 'places' }" @click="activeTab = 'places'"><Landmark :size="14" /> Locais</button>
      <button class="pill" :class="{ active: activeTab === 'events' }" @click="activeTab = 'events'"><Music :size="14" /> Eventos</button>
    </div>

    <!-- Places -->
    <div v-if="activeTab === 'places'">
      <div v-if="!favPlaces.length" class="empty-state">
        <Heart class="empty-icon" :size="44" />
        <div class="empty-title">Nenhum local favorito ainda</div>
        <div class="empty-sub">Explore o guia e salve os lugares que você quer visitar</div>
        <AppButton to="/" style="margin-top:16px;">Explorar locais</AppButton>
      </div>
      <div v-else class="cards-grid">
        <PlaceCard v-for="fav in favPlaces" :key="fav.id" :place="fav.place" />
      </div>
    </div>

    <!-- Events -->
    <div v-if="activeTab === 'events'">
      <div v-if="!favEvents.length" class="empty-state">
        <PartyPopper class="empty-icon" :size="44" />
        <div class="empty-title">Nenhum evento favorito ainda</div>
        <AppButton to="/calendario" style="margin-top:16px;">Ver eventos</AppButton>
      </div>
      <div v-else class="cards-grid">
        <EventCard v-for="fav in favEvents" :key="fav.id" :event="fav.event" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Landmark, Music, Heart, PartyPopper } from 'lucide-vue-next';
import { useFavoritesStore } from '@/stores/favorites.store';
import PlaceCard from '@/components/PlaceCard.vue';
import EventCard from '@/components/EventCard.vue';
import AppButton from '@/components/AppButton.vue';

const favs      = useFavoritesStore();
const activeTab = ref<'places'|'events'>('places');

const favPlaces = computed(() => favs.items.filter(f => f.place) as unknown as Array<{id:string; place: import('@/stores/places.store').Place}>);
const favEvents = computed(() => favs.items.filter(f => f.event) as unknown as Array<{id:string; event: import('@/stores/events.store').AteneuEvent}>);

onMounted(() => favs.fetchFavorites());
</script>

<style scoped>
.page-main { max-width: 1300px; margin: 0 auto; padding: 32px 40px 80px; }
.page-header { margin-bottom: 24px; }
.page-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -.5px; }
.page-sub { color: var(--text2); font-size: 14px; }
.fav-tabs { display: flex; gap: 8px; margin-bottom: 28px; }
.cards-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
@media(max-width:1100px){ .cards-grid { grid-template-columns: repeat(3,1fr); } }
@media(max-width:780px) { .cards-grid { grid-template-columns: repeat(2,1fr); } }
.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon { color: var(--border); margin-bottom: 16px; }
.empty-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.empty-sub { color: var(--text2); font-size: 14px; }
</style>
