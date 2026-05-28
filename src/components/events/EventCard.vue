<script setup lang="ts">
import { Heart } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import StarRating from '@/components/ui/StarRating.vue'
import CategoryTag from '@/components/ui/CategoryTag.vue'
import type { EventSummary } from '@/types/event'

const props = defineProps<{
  event: EventSummary
  variant?: 'grid' | 'list' | 'mini'
}>()

const emit = defineEmits<{ 'toggle-favorite': [id: string] }>()
const router = useRouter()

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}

function formatPrice(price: number, isFree: boolean) {
  if (isFree) return 'Grátis'
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  img.parentElement!.classList.add('bg-gradient-to-br', 'from-brand-dark', 'to-brand-purple')
}
</script>

<template>
  <!-- GRID variant -->
  <article
    v-if="variant === 'grid' || !variant"
    class="bg-brand-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-200 cursor-pointer group"
    :aria-label="event.title"
    @click="router.push(`/eventos/${event.id}`)"
  >
    <div class="relative aspect-[4/3] overflow-hidden">
      <img
        :src="event.coverImage"
        :alt="event.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        @error="onImageError"
      />
      <div class="absolute bottom-2 left-2">
        <CategoryTag :category="event.category" />
      </div>
      <button
        class="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
        :aria-label="event.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
        :aria-pressed="event.isFavorite"
        @click.stop="emit('toggle-favorite', event.id)"
      >
        <Heart :size="18" :fill="event.isFavorite ? '#7C3AED' : 'none'" :stroke="event.isFavorite ? '#7C3AED' : 'white'" />
      </button>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2">{{ event.title }}</h3>
      <p class="text-xs text-gray-400 mb-2">{{ formatDate(event.startDate) }} · {{ event.startTime }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <StarRating :value="event.avgRating" size="sm" />
          <span class="text-xs text-gray-400">{{ event.avgRating.toFixed(1) }} ({{ event.reviewCount }})</span>
        </div>
        <span class="text-xs font-medium" :class="event.isFree ? 'text-green-400' : 'text-gray-300'">
          {{ formatPrice(event.ticketPrice, event.isFree) }}
        </span>
      </div>
    </div>
  </article>

  <!-- LIST variant (US009) -->
  <article
    v-else-if="variant === 'list'"
    class="flex gap-4 bg-brand-card rounded-2xl overflow-hidden p-3 cursor-pointer hover:bg-brand-card-hover transition-colors"
    :aria-label="event.title"
  >
    <div class="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
      <img :src="event.coverImage" :alt="event.title" class="w-full h-full object-cover" loading="lazy" @error="onImageError" />
      <div class="absolute top-1 left-1">
        <CategoryTag :category="event.category" />
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-white text-sm line-clamp-1">{{ event.title }}</h3>
      <p class="text-xs text-gray-400 mt-0.5">{{ event.startTime }} – {{ event.endTime }}</p>
      <p class="text-xs text-gray-500 mt-0.5 truncate">{{ event.venue?.name }}</p>
      <div class="flex items-center justify-between mt-2">
        <span class="text-xs font-medium" :class="event.isFree ? 'text-green-400' : 'text-gray-300'">
          {{ formatPrice(event.ticketPrice, event.isFree) }}
        </span>
        <button
          class="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center flex-shrink-0"
          :aria-label="`Ver detalhes de ${event.title}`"
          @click="router.push(`/eventos/${event.id}`)"
        >
          <span class="text-white text-xs">→</span>
        </button>
      </div>
    </div>
  </article>

  <!-- MINI variant (US010) -->
  <article
    v-else-if="variant === 'mini'"
    class="bg-brand-card rounded-xl overflow-hidden cursor-pointer hover:bg-brand-card-hover transition-colors"
    :aria-label="event.title"
    @click="router.push(`/eventos/${event.id}`)"
  >
    <div class="aspect-video overflow-hidden">
      <img :src="event.coverImage" :alt="event.title" class="w-full h-full object-cover" loading="lazy" @error="onImageError" />
    </div>
    <div class="p-3">
      <h3 class="font-semibold text-white text-xs line-clamp-2 mb-1">{{ event.title }}</h3>
      <p class="text-xs text-gray-400 mb-2">{{ formatDate(event.startDate) }}</p>
      <button
        class="text-xs text-brand-purple border border-brand-purple/40 hover:bg-brand-purple/10 rounded-lg px-3 py-1.5 transition-colors w-full"
        @click.stop="router.push(`/eventos/${event.id}`)"
      >
        Ver Detalhes
      </button>
    </div>
  </article>
</template>
