<template>
  <main class="detail-page" v-if="event">
    <RouterLink to="/calendario" class="back-link"><ChevronLeft :size="16" /> Voltar ao Calendário</RouterLink>
    <div class="detail-hero" :style="heroStyle">
      <div class="detail-hero-overlay"></div>
      <component :is="categoryIcon(event.category)" class="detail-emoji" :size="80" />
    </div>
    <div class="detail-content">
      <div class="detail-main">
        <div class="detail-tags">
          <span class="tag" :class="`tag-${event.category}`">{{ LABEL[event.category] }}</span>
          <span v-if="event.isFree" class="tag tag-free">Grátis</span>
        </div>
        <h1 class="detail-title">{{ event.title }}</h1>
        <div class="detail-meta">
          <span><Calendar :size="15" /> {{ formatDate(event.date) }}</span>
          <span><Clock :size="15" /> {{ formatTime(event.date) }}<template v-if="event.endDate">–{{ formatTime(event.endDate) }}</template></span>
          <span v-if="event.place || event.address"><MapPin :size="15" /> {{ event.place?.name ?? event.address }}</span>
        </div>
        <p class="detail-desc" v-if="event.description">{{ event.description }}</p>
      </div>
      <div class="detail-side">
        <div class="price-display" :class="event.isFree ? 'price-free' : 'price-paid'">
          {{ event.isFree ? 'Entrada Gratuita' : (event.priceLabel ?? `R$ ${event.price?.toFixed(2) ?? '—'}`) }}
        </div>
        <AppButton v-if="event.ticketUrl && !event.isFree" :href="event.ticketUrl" target="_blank" block style="margin-top:10px;">
          Comprar Ingresso
        </AppButton>
        <AppButton variant="ghost" block style="margin-top:10px;" @click="favs.toggle(undefined, event.id)">
          <Heart :size="16" :fill="favs.isFaved(undefined, event.id) ? 'currentColor' : 'none'" />
          {{ favs.isFaved(undefined, event.id) ? 'Remover dos favoritos' : 'Favoritar' }}
        </AppButton>
      </div>
    </div>
  </main>
  <main v-else class="detail-page" style="display:flex;align-items:center;justify-content:center;min-height:60vh;">
    <div style="text-align:center;color:var(--text2)">{{ loading ? 'Carregando...' : 'Evento não encontrado.' }}</div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronLeft, Calendar, Clock, MapPin, Heart } from 'lucide-vue-next';
import api from '@/services/api';
import { useFavoritesStore } from '@/stores/favorites.store';
import { categoryIcon } from '@/lib/categoryIcons';
import AppButton from '@/components/AppButton.vue';
import type { AteneuEvent } from '@/stores/events.store';

const route   = useRoute();
const favs    = useFavoritesStore();
const event   = ref<AteneuEvent | null>(null);
const loading = ref(true);

const LABEL: Record<string,string> = { CINEMA:'Cinema', TEATRO:'Teatro', SHOWS:'Shows', GASTRONOMIA:'Gastronomia', MUSEU:'Museu', PARQUE:'Parque', IGREJA:'Igreja', FEIRA:'Feira', EXPOSICAO:'Exposição', AR_LIVRE:'Ar Livre', OUTRO:'Evento' };

const heroStyle = computed(() => ({
  background: event.value?.imageUrl
    ? `url(${event.value.imageUrl}) center/cover`
    : 'linear-gradient(135deg,#1a0633,#3d1070,#6b1fa4)',
}));

function formatDate(d: string) { return new Date(d).toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' }); }
function formatTime(d: string) { return new Date(d).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }); }

onMounted(async () => {
  try {
    const { data } = await api.get(`/events/${route.params.id}`);
    event.value = data.data;
  } finally { loading.value = false; }
});
</script>

<style scoped>
.detail-page { max-width: 1100px; margin: 0 auto; padding: 24px 40px 80px; }
.back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--text2); font-size: 14px; text-decoration: none; margin-bottom: 20px; cursor: pointer; }
.back-link:hover { color: var(--text); }
.detail-hero { height: 280px; border-radius: 20px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 28px; }
.detail-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.5), transparent); }
.detail-emoji { color: #fff; opacity: .25; z-index: 1; }
.detail-content { display: grid; grid-template-columns: 1fr 220px; gap: 32px; }
@media(max-width:700px){ .detail-content { grid-template-columns: 1fr; } }
.detail-tags { display: flex; gap: 8px; margin-bottom: 12px; }
.detail-meta span { display: flex; align-items: center; gap: 6px; }
.detail-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; letter-spacing: -.5px; margin-bottom: 12px; }
.detail-meta { display: flex; flex-direction: column; gap: 4px; font-size: 14px; color: var(--text2); margin-bottom: 20px; }
.detail-desc { font-size: 15px; line-height: 1.7; color: var(--text2); }
.price-display { text-align: center; font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; padding: 16px; background: var(--card); border: 1px solid var(--border2); border-radius: 12px; }
.price-free { color: var(--green); }
.price-paid { color: var(--amber); }
</style>
