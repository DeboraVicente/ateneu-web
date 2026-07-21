<template>
  <main class="detail-page" v-if="place">
    <RouterLink to="/" class="back-link"><ChevronLeft :size="16" /> Voltar</RouterLink>
    <div class="detail-hero" :style="heroStyle">
      <div class="detail-hero-overlay"></div>
      <component :is="categoryIcon(place.category)" class="detail-emoji" :size="80" />
    </div>
    <div class="detail-content">
      <div class="detail-main">
        <div class="detail-tags">
          <span class="tag" :class="`tag-${place.category}`">{{ LABEL[place.category] }}</span>
          <span v-if="place.isFree" class="tag tag-free">Grátis</span>
        </div>
        <h1 class="detail-title">{{ place.name }}</h1>
        <div class="detail-meta">
          <span><MapPin :size="15" /> {{ place.address }}</span>
          <span v-if="place.phone"><Phone :size="15" /> {{ place.phone }}</span>
          <span v-if="place.website"><a :href="place.website" target="_blank"><Globe :size="15" /> Website</a></span>
        </div>
        <p class="detail-desc" v-if="place.description">{{ place.description }}</p>

        <!-- Opening hours -->
        <div v-if="place.openingHours" class="detail-hours">
          <h3 class="detail-section-title">Horários de Visitação</h3>
          <div v-for="(hours, day) in (place.openingHours as Record<string,string>)" :key="day" class="hours-row">
            <span class="hours-day">{{ day }}</span>
            <span class="hours-time">{{ hours }}</span>
          </div>
        </div>
      </div>

      <div class="detail-side">
        <AppButton block style="margin-bottom:12px;" @click="favs.toggle(place.id)">
          <Heart :size="16" :fill="favs.isFaved(place.id) ? 'currentColor' : 'none'" />
          {{ favs.isFaved(place.id) ? 'Remover dos favoritos' : 'Favoritar' }}
        </AppButton>
        <div v-if="place.priceLevel" class="price-badge">{{'$'.repeat(place.priceLevel)}}</div>
      </div>
    </div>
  </main>
  <main v-else class="detail-page" style="display:flex;align-items:center;justify-content:center;">
    <div v-if="loading" style="text-align:center;color:var(--text2)">Carregando...</div>
    <div v-else style="text-align:center;color:var(--text2)">Local não encontrado.</div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, MapPin, Phone, Globe, Heart } from 'lucide-vue-next';
import api from '@/services/api';
import { useFavoritesStore } from '@/stores/favorites.store';
import { categoryIcon } from '@/lib/categoryIcons';
import AppButton from '@/components/AppButton.vue';
import type { Place } from '@/stores/places.store';

const route   = useRoute();
const favs    = useFavoritesStore();
const place   = ref<Place | null>(null);
const loading = ref(true);

const LABEL: Record<string,string> = { CINEMA:'Cinema', TEATRO:'Teatro', SHOWS:'Shows', GASTRONOMIA:'Gastronomia', MUSEU:'Museu', PARQUE:'Parque', IGREJA:'Igreja', FEIRA:'Feira', EXPOSICAO:'Exposição', AR_LIVRE:'Ar Livre', OUTRO:'Local' };
const GRADIENTS: Record<string,string> = { MUSEU:'linear-gradient(135deg,#0d1a2b,#1a3d6b,#2c6ba4)', PARQUE:'linear-gradient(135deg,#0d2b1a,#1a6b3d,#2ca46b)', GASTRONOMIA:'linear-gradient(135deg,#1a0b2e,#3d1a6e,#6b2ca4)', SHOWS:'linear-gradient(135deg,#1a0633,#3d1070,#6b1fa4)' };

const heroStyle = computed(() => ({
  background: place.value?.imageUrl
    ? `url(${place.value.imageUrl}) center/cover`
    : (GRADIENTS[place.value?.category ?? ''] ?? 'linear-gradient(135deg,#1a1630,#2d2654)'),
}));

onMounted(async () => {
  try {
    const { data } = await api.get(`/places/${route.params.id}`);
    place.value = data.data;
  } finally { loading.value = false; }
});
</script>

<style scoped>
.detail-page { max-width: 1100px; margin: 0 auto; padding: 24px 40px 80px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--text2); font-size: 14px; text-decoration: none; margin-bottom: 20px; cursor: pointer; transition: .15s; }
.back-link:hover { color: var(--text); }
.detail-hero { height: 280px; border-radius: 20px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 28px; }
.detail-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.5), transparent); }
.detail-emoji { color: #fff; opacity: .25; z-index: 1; }
.detail-content { display: grid; grid-template-columns: 1fr 240px; gap: 32px; }
@media(max-width:700px){ .detail-content { grid-template-columns: 1fr; } }
.detail-tags { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
.detail-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -.5px; margin-bottom: 12px; }
.detail-meta { display: flex; flex-direction: column; gap: 4px; font-size: 14px; color: var(--text2); margin-bottom: 20px; }
.detail-meta span, .detail-meta a { display: flex; align-items: center; gap: 6px; }
.detail-meta a { color: var(--accent); text-decoration: none; }
.detail-desc { font-size: 15px; line-height: 1.7; color: var(--text2); margin-bottom: 28px; }
.detail-section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 12px; }
.detail-hours { background: var(--card); border: 1px solid var(--border2); border-radius: 12px; padding: 16px 20px; }
.hours-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border2); font-size: 14px; }
.hours-row:last-child { border-bottom: none; }
.hours-day { color: var(--text2); text-transform: capitalize; }
.hours-time { font-weight: 500; }
.detail-side { display: flex; flex-direction: column; }
.price-badge { font-size: 18px; font-weight: 700; color: var(--amber); text-align: center; margin-top: 8px; }
</style>
