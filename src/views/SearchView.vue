<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import EventCard from '@/components/events/EventCard.vue'
import EventCardSkeleton from '@/components/events/EventCardSkeleton.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import { useAuthStore } from '@/stores/auth'
import type { EventSummary } from '@/types/event'

const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const events = ref<EventSummary[]>([])
const loading = ref(false)
const showAuthModal = ref(false)

const query = ref((route.query['q'] as string) ?? '')

async function search() {
  if (!query.value) return
  loading.value = true
  try {
    const { data } = await api.events.getAll({ page: 1 })
    events.value = data.data
  } finally {
    loading.value = false
  }
}

async function handleToggleFavorite(eventId: string) {
  const event = events.value.find((e) => e.id === eventId)
  if (!event) return
  if (!authStore.isAuthenticated) { showAuthModal.value = true; return }
  const prev = event.isFavorite
  event.isFavorite = !prev
  try {
    event.isFavorite ? await api.favorites.add(event.id) : await api.favorites.remove(event.id)
  } catch {
    event.isFavorite = prev
    toast.error('Não foi possível salvar.')
  }
}

watch(() => route.query['q'], (q) => { query.value = q as string ?? ''; search() })
onMounted(search)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <h1 class="text-2xl font-bold mb-2">
      {{ query ? `Resultados para "${query}"` : 'Todos os eventos' }}
    </h1>
    <p class="text-gray-400 text-sm mb-6">{{ events.length }} evento(s) encontrado(s)</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="loading">
        <EventCardSkeleton v-for="n in 8" :key="n" variant="grid" />
      </template>
      <template v-else>
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          variant="grid"
          @toggle-favorite="handleToggleFavorite"
        />
      </template>
    </div>

    <AuthModal v-model="showAuthModal" />
  </div>
</template>
