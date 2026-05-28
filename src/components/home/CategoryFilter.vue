<script setup lang="ts">
import { Film, Theater, Music, UtensilsCrossed, Landmark, Trees } from 'lucide-vue-next'
import { CATEGORY_LABELS } from '@/types/event'
import type { EventCategory } from '@/types/event'

const props = defineProps<{ modelValue: EventCategory }>()
const emit = defineEmits<{ 'update:modelValue': [v: EventCategory] }>()

const categories: { value: EventCategory; icon: any }[] = [
  { value: 'all', icon: null },
  { value: 'cinema', icon: Film },
  { value: 'theater', icon: Theater },
  { value: 'shows', icon: Music },
  { value: 'gastronomy', icon: UtensilsCrossed },
  { value: 'museums', icon: Landmark },
  { value: 'outdoor', icon: Trees },
]
</script>

<template>
  <nav aria-label="Filtros de categoria" class="overflow-x-auto scrollbar-hide">
    <ul class="flex gap-2 py-1" role="list">
      <li v-for="cat in categories" :key="cat.value" role="none">
        <button
          role="listitem"
          :aria-pressed="modelValue === cat.value"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          :class="modelValue === cat.value
            ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20'
            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'"
          @click="emit('update:modelValue', cat.value)"
        >
          <component :is="cat.icon" v-if="cat.icon" :size="14" />
          {{ CATEGORY_LABELS[cat.value] }}
        </button>
      </li>
    </ul>
  </nav>
</template>
