<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/services/api'
import HeroBanner from '@/components/home/HeroBanner.vue'
import CategoryFilter from '@/components/home/CategoryFilter.vue'
import EventGrid from '@/components/home/EventGrid.vue'
import type { HighlightEvent, EventCategory } from '@/types/event'

const route = useRoute()
const router = useRouter()

const highlights = ref<HighlightEvent[]>([])
const loadingHighlights = ref(true)
const selectedCategory = ref<EventCategory>((route.query['category'] as EventCategory) ?? 'all')

async function fetchHighlights() {
  try {
    const { data } = await api.highlights.get()
    highlights.value = data
  } finally {
    loadingHighlights.value = false
  }
}

watch(selectedCategory, (val) => {
  router.replace({ query: val !== 'all' ? { category: val } : {} })
})

onMounted(fetchHighlights)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
    <!-- US001: Hero Banner -->
    <HeroBanner :highlights="highlights" :loading="loadingHighlights" />

    <!-- US002: Category Filters -->
    <CategoryFilter v-model="selectedCategory" />

    <!-- US003 + US005: Eventos recomendados com sort -->
    <EventGrid :category="selectedCategory" />
  </div>
</template>
