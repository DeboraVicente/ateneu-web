<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useEventFavorite } from '@/composables/useEventFavorite'
import { useToast } from 'vue-toastification'
import EventCard from '@/components/events/EventCard.vue'
import EventCardSkeleton from '@/components/events/EventCardSkeleton.vue'
import SortDropdown from '@/components/ui/SortDropdown.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import type { EventSummary, EventCategory, SortOption } from '@/types/event'

const props = defineProps<{ category: EventCategory }>()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const events = ref<EventSummary[]>([])
const loading = ref(false)
const sortBy = ref<SortOption>('relevance')
const showAuthModal = ref(false)

async function fetchEvents() {
  loading.value = true
  try {
    const { data } = await api.events.getRecommended({ limit: 4, sort: sortBy.value })
    events.value = data
  } catch {
    toast.error('Não foi possível carregar os eventos.')
  } finally {
    loading.value = false
  }
}

async function handleToggleFavorite(eventId: string) {
  const event = events.value.find((e) => e.id === eventId)
  if (!event) return

  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  const prev = event.isFavorite
  event.isFavorite = !prev
  try {
    if (event.isFavorite) {
      await api.favorites.add(event.id)
    } else {
      await api.favorites.remove(event.id)
    }
  } catch {
    event.isFavorite = prev
    toast.error('Não foi possível salvar. Tente novamente.')
  }
}

watch([() => props.category, sortBy], fetchEvents)
onMounted(fetchEvents)
</script>

<template>
  <section aria-label="Eventos recomendados">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-xl font-bold text-white">Para você curtir</h2>
      <SortDropdown v-model="sortBy" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="loading">
        <EventCardSkeleton v-for="n in 4" :key="n" variant="grid" />
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

    <div class="mt-6 text-center">
      <button
        class="text-sm text-brand-purple border border-brand-purple/40 hover:bg-brand-purple/10 rounded-xl px-6 py-3 transition-colors"
        @click="router.push('/busca')"
      >
        Ver todos os eventos
      </button>
    </div>

    <AuthModal v-model="showAuthModal" />
  </section>
</template>
