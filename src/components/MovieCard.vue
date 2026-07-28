<template>
  <div class="movie-card card-surface">
    <div class="movie-poster" :style="posterStyle">
      <Clapperboard v-if="!movie.posterUrl" class="poster-fallback" :size="40" />
      <span class="movie-rating"><Star :size="12" fill="currentColor" /> {{ ratingLabel }}</span>
    </div>
    <div class="movie-body">
      <div class="movie-title">{{ movie.title }}</div>
      <div class="movie-date">{{ releaseLabel }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Star, Clapperboard } from 'lucide-vue-next';
import type { Movie } from '@/stores/movies.store';

const props = defineProps<{ movie: Movie }>();

const posterStyle = computed(() => ({
  background: props.movie.posterUrl
    ? `url(${props.movie.posterUrl}) center/cover`
    : 'linear-gradient(135deg,#2b0d1a,#6b1a3d,#a42c6b)',
}));

const ratingLabel = computed(() => props.movie.voteAverage.toFixed(1));

const releaseLabel = computed(() => {
  if (!props.movie.releaseDate) return '';
  const [y, m, d] = props.movie.releaseDate.split('-');
  return `${d}/${m}/${y}`;
});
</script>

<style scoped>
.movie-card {
  flex: 0 0 150px;
  border-radius: 14px;
  overflow: hidden;
}

.movie-poster {
  position: relative;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.poster-fallback { color: rgba(255,255,255,.5); }

.movie-rating {
  position: absolute; top: 8px; right: 8px;
  display: flex; align-items: center; gap: 3px;
  padding: 3px 7px; border-radius: 20px;
  background: rgba(13,11,20,.7); backdrop-filter: blur(8px);
  color: #ffd166; font-size: 12px; font-weight: 600;
}

.movie-body { padding: 10px 12px; }
.movie-title {
  font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px;
  letter-spacing: -.2px; color: var(--text);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}
.movie-date { font-size: 12px; color: var(--text3); margin-top: 4px; }
</style>
