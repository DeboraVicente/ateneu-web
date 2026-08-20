<template>
  <RouterLink :to="`/local/${place.id}`" class="place-card card-surface fade-up">
    <div class="card-thumb" :style="thumbStyle">
      <div class="thumb-overlay"></div>
      <component :is="categoryIcon(place.category)" class="thumb-emoji" :size="48" />

      <!-- Fav button -->
      <button
        class="fav-btn"
        :class="{ active: isFaved }"
        @click.prevent="handleFav"
        :title="isFaved ? 'Remover dos favoritos' : 'Favoritar'"
      >
        <Heart :size="15" :fill="isFaved ? 'currentColor' : 'none'" />
      </button>

      <!-- Category tag -->
      <span class="card-tag" :class="`tag tag-${place.category}`">
        {{ categoryLabel }}
      </span>
    </div>

    <div class="card-body">
      <div class="card-title">{{ place.name }}</div>
      <div class="card-meta">
        <span class="card-address">{{ shortAddress }}</span>
        <span class="card-price" :class="priceClass">{{ priceLabel }}</span>
      </div>
      <div v-if="place.distanceKm !== undefined" class="card-dist">
        <MapPin :size="12" /> {{ place.distanceKm }} km
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Heart, MapPin } from 'lucide-vue-next';
import { useFavoritesStore } from '@/stores/favorites.store';
import { categoryIcon } from '@/lib/categoryIcons';
import type { Place } from '@/stores/places.store';

const props = defineProps<{ place: Place }>();

const favs   = useFavoritesStore();
const route  = useRoute();
const router = useRouter();
const isFaved = computed(() => favs.isFaved(props.place.id));

const CATEGORY_LABEL: Record<string, string> = {
  CINEMA: 'Cinema', TEATRO: 'Teatro', SHOWS: 'Shows', GASTRONOMIA: 'Gastronomia',
  MUSEU: 'Museu', PARQUE: 'Parque', IGREJA: 'Igreja', FEIRA: 'Feira',
  EXPOSICAO: 'Exposição', AR_LIVRE: 'Ar Livre', OUTRO: 'Local',
};
const THUMB_GRADIENTS: Record<string, string> = {
  CINEMA:      'linear-gradient(135deg,#2b0d1a,#6b1a3d,#a42c6b)',
  TEATRO:      'linear-gradient(135deg,#1a0d2b,#3d1a6b,#6b2ca4)',
  SHOWS:       'linear-gradient(135deg,#1a0633,#3d1070,#6b1fa4)',
  GASTRONOMIA: 'linear-gradient(135deg,#1a0b2e,#3d1a6e,#6b2ca4)',
  MUSEU:       'linear-gradient(135deg,#0d1a2b,#1a3d6b,#2c6ba4)',
  PARQUE:      'linear-gradient(135deg,#0d2b1a,#1a6b3d,#2ca46b)',
  IGREJA:      'linear-gradient(135deg,#2b2b0d,#6b6b1a,#a4a42c)',
  FEIRA:       'linear-gradient(135deg,#0d2218,#1a4a30,#2c8a54)',
  EXPOSICAO:   'linear-gradient(135deg,#0d1a2b,#1a3d6b,#2c6ba4)',
  AR_LIVRE:    'linear-gradient(135deg,#1a2b0d,#3d6b1a,#6ba42c)',
  OUTRO:       'linear-gradient(135deg,#1a1630,#2d2654,#4a3d8a)',
};

const categoryLabel = computed(() => CATEGORY_LABEL[props.place.category] ?? props.place.category);

const thumbStyle = computed(() => ({
  background: props.place.imageUrl
    ? `url(${props.place.imageUrl}) center/cover`
    : (THUMB_GRADIENTS[props.place.category] ?? THUMB_GRADIENTS.OUTRO),
}));

const shortAddress = computed(() => {
  const parts = props.place.address?.split(',');
  return parts?.[0] ?? props.place.address ?? '';
});

const priceLabel = computed(() => {
  if (props.place.isFree) return 'Grátis';
  if (!props.place.priceLevel) return '';
  return '$'.repeat(props.place.priceLevel);
});
const priceClass = computed(() => {
  if (props.place.isFree) return 'price-free';
  if (props.place.priceLevel === 3) return 'price-premium';
  return 'price-paid';
});

async function handleFav() {
  const ok = await favs.toggle(props.place.id);
  if (!ok) {
    router.push({ name: 'auth', query: { redirect: route.fullPath } });
  }
}
</script>

<style scoped>
.place-card {
  display: block; text-decoration: none; color: inherit; cursor: pointer;
  border-radius: 14px; overflow: hidden;
}

.card-thumb {
  position: relative; height: 168px; overflow: hidden;
}
.thumb-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%);
}
.thumb-emoji {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  color: #fff; opacity: .32; user-select: none;
  transition: .3s;
}
.place-card:hover .thumb-emoji { transform: translate(-50%,-50%) scale(1.1); opacity: .45; }

.fav-btn {
  position: absolute; top: 10px; right: 10px;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(13,11,20,.7); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: .15s; color: #fff;
}
.fav-btn:hover { color: var(--vermelho); border-color: color-mix(in srgb, var(--vermelho) 30%, transparent); }
.fav-btn.active { color: var(--vermelho); }

.card-tag {
  position: absolute; bottom: 10px; left: 10px;
}

.card-body { padding: 14px 16px; }
.card-title {
  font-family: 'Syne', sans-serif; font-weight: 600; font-size: 15px;
  letter-spacing: -.2px; margin-bottom: 4px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--text);
}
.card-meta {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: var(--text2);
}
.card-address { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
.card-price { font-weight: 600; font-size: 13px; flex-shrink: 0; }
.price-free    { color: var(--green); }
.price-paid    { color: var(--text2); }
.price-premium { color: var(--amber); }
.card-dist { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text3); margin-top: 4px; }
</style>
