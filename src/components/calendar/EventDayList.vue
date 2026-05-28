<script setup lang="ts">
import EventCard from '@/components/events/EventCard.vue'
import EventCardSkeleton from '@/components/events/EventCardSkeleton.vue'
import type { EventSummary } from '@/types/event'

defineProps<{
  selectedDate: string
  events: EventSummary[]
  loading: boolean
}>()

const emit = defineEmits<{ 'toggle-favorite': [id: string] }>()

function formatHeader(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-white">Eventos em {{ formatHeader(selectedDate) }}</h2>
      <span v-if="!loading" class="text-xs bg-brand-purple/20 text-brand-purple px-2 py-1 rounded-full">
        {{ events.length }} evento(s)
      </span>
    </div>

    <div class="flex flex-col gap-3">
      <template v-if="loading">
        <EventCardSkeleton v-for="n in 3" :key="n" variant="list" />
      </template>
      <template v-else-if="events.length">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          variant="list"
          @toggle-favorite="emit('toggle-favorite', $event)"
        />
      </template>
      <p v-else class="text-gray-500 text-sm text-center py-8">
        Nenhum evento nesta data.
      </p>
    </div>
  </div>
</template>
