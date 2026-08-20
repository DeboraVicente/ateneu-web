<template>
  <RouterLink :to="`/evento/${event.id}`" class="event-card card-surface fade-up">
    <div class="event-thumb" :style="thumbStyle">
      <div class="thumb-overlay"></div>
      <component :is="categoryIcon(event.category)" class="thumb-emoji" :size="48" />

      <button class="fav-btn" :class="{ active: isFaved }" @click.prevent="handleFav">
        <Heart :size="15" :fill="isFaved ? 'currentColor' : 'none'" />
      </button>
      <span class="card-tag" :class="`tag-${event.category}`">{{ categoryLabel }}</span>
    </div>

    <div class="event-body">
      <div class="event-title">{{ event.title }}</div>
      <div class="event-meta">
        <span class="meta-item"><Clock :size="12" /> {{ formattedTime }}</span>
        <span v-if="event.place" class="meta-item"><MapPin :size="12" /> {{ event.place.name }}</span>
      </div>
      <div class="event-price" :class="priceClass">{{ priceLabel }}</div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Heart, Clock, MapPin } from 'lucide-vue-next';
import { useFavoritesStore } from '@/stores/favorites.store';
import { categoryIcon } from '@/lib/categoryIcons';
import type { AteneuEvent } from '@/stores/events.store';

const props  = defineProps<{ event: AteneuEvent }>();
const favs   = useFavoritesStore();
const route  = useRoute();
const router = useRouter();
const isFaved = computed(() => favs.isFaved(undefined, props.event.id));

async function handleFav() {
  const ok = await favs.toggle(undefined, props.event.id);
  if (!ok) {
    router.push({ name: 'auth', query: { redirect: route.fullPath } });
  }
}

const CATEGORY_LABEL: Record<string, string> = {
  CINEMA: 'Cinema', TEATRO: 'Teatro', SHOWS: 'Shows', GASTRONOMIA: 'Gastronomia',
  MUSEU: 'Museu', PARQUE: 'Parque', IGREJA: 'Igreja', FEIRA: 'Feira',
  EXPOSICAO: 'Exposição', AR_LIVRE: 'Ar Livre', OUTRO: 'Evento',
};
const THUMB_BG: Record<string, string> = {
  SHOWS:  'linear-gradient(135deg,#1a0633,#3d1070,#6b1fa4)',
  TEATRO: 'linear-gradient(135deg,#1a0d2b,#3d1a6b,#6b2ca4)',
  GASTRONOMIA: 'linear-gradient(135deg,#1a0b2e,#3d1a6e,#6b2ca4)',
  MUSEU:  'linear-gradient(135deg,#0d1a2b,#1a3d6b,#2c6ba4)',
  PARQUE: 'linear-gradient(135deg,#0d2b1a,#1a6b3d,#2ca46b)',
  OUTRO:  'linear-gradient(135deg,#1a1630,#2d2654,#4a3d8a)',
};

const categoryLabel = computed(() => CATEGORY_LABEL[props.event.category] ?? props.event.category);
const thumbStyle    = computed(() => ({
  background: props.event.imageUrl
    ? `url(${props.event.imageUrl}) center/cover`
    : (THUMB_BG[props.event.category] ?? THUMB_BG.OUTRO),
}));

const formattedTime = computed(() => {
  const d = new Date(props.event.date);
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (props.event.endDate) {
    const e = new Date(props.event.endDate);
    return `${time}–${e.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  return time;
});

const priceLabel = computed(() => {
  if (props.event.isFree) return 'Grátis';
  if (props.event.priceLabel) return props.event.priceLabel;
  if (props.event.price) return `R$ ${props.event.price.toFixed(2)}`;
  return '';
});
const priceClass = computed(() =>
  props.event.isFree ? 'price-free' : 'price-paid'
);
</script>

<style scoped>
.event-card { display: block; text-decoration: none; color: inherit; border-radius: 14px; overflow: hidden; }
.event-thumb { position: relative; height: 168px; overflow: hidden; }
.thumb-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%); }
.thumb-emoji { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); color: #fff; opacity: .32; user-select: none; transition: .3s; }
.event-card:hover .thumb-emoji { transform: translate(-50%,-50%) scale(1.1); opacity: .45; }
.fav-btn { position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; border-radius: 50%; background: rgba(13,11,20,.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; transition: .15s; }
.fav-btn:hover, .fav-btn.active { color: var(--vermelho); }
.event-body { padding: 14px 16px; }
.event-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 15px; letter-spacing: -.2px; margin-bottom: 6px; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.event-meta { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--text2); margin-bottom: 6px; }
.meta-item { display: flex; align-items: center; gap: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.event-price { font-size: 13px; font-weight: 600; }
.price-free { color: var(--green); }
.price-paid { color: var(--text2); }
</style>
