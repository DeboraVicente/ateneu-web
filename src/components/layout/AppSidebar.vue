<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import EventCard from '@/components/events/EventCard.vue'
import EventCardSkeleton from '@/components/events/EventCardSkeleton.vue'
import type { HighlightEvent } from '@/types/event'

const highlights = ref<HighlightEvent[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.highlights.getSidebar(2)
    highlights.value = data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <aside aria-label="Destaques da semana" class="space-y-4">
    <h3 class="font-semibold text-white text-sm">Destaques da Semana</h3>
    <template v-if="loading">
      <EventCardSkeleton v-for="n in 2" :key="n" variant="mini" />
    </template>
    <template v-else>
      <EventCard
        v-for="h in highlights"
        :key="h.id"
        :event="h as any"
        variant="mini"
      />
    </template>
  </aside>
</template>
