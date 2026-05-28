<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Heart, ArrowLeft, Clock, MapPin, Ticket, Users } from 'lucide-vue-next'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { CATEGORY_LABELS } from '@/types/event'
import MediaGallery from '@/components/detail/MediaGallery.vue'
import MapWidget from '@/components/detail/MapWidget.vue'
import ReviewsPanel from '@/components/detail/ReviewsPanel.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import StarRating from '@/components/ui/StarRating.vue'
import CategoryTag from '@/components/ui/CategoryTag.vue'
import type { EventDetail } from '@/types/event'
import type { ReviewSummary } from '@/types/review'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const eventId = route.params['id'] as string

const event = ref<EventDetail | null>(null)
const summary = ref<ReviewSummary | null>(null)
const loading = ref(true)
const showAuthModal = ref(false)
const favoriteLoading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const [eventRes, summaryRes] = await Promise.all([
      api.events.getById(eventId),
      api.reviews.getSummary(eventId),
    ])
    event.value = eventRes.data
    summary.value = summaryRes.data
  } catch {
    toast.error('Evento não encontrado.')
    router.push('/')
  } finally {
    loading.value = false
  }
}

async function toggleFavorite() {
  if (!authStore.isAuthenticated) { showAuthModal.value = true; return }
  if (!event.value || favoriteLoading.value) return

  const prev = event.value.isFavorite
  event.value.isFavorite = !prev
  favoriteLoading.value = true
  try {
    prev ? await api.favorites.remove(eventId) : await api.favorites.add(eventId)
  } catch {
    event.value.isFavorite = prev
    toast.error('Não foi possível salvar.')
  } finally {
    favoriteLoading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

onMounted(fetchData)
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Back -->
    <button
      class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
      @click="router.back()"
    >
      <ArrowLeft :size="16" />
      Voltar
    </button>

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="animate-pulse space-y-4">
        <div class="w-full h-72 bg-white/10 rounded-2xl" />
        <div class="h-8 bg-white/10 rounded w-2/3" />
        <div class="h-4 bg-white/10 rounded w-1/3" />
        <div class="h-24 bg-white/10 rounded" />
      </div>
    </template>

    <template v-else-if="event">
      <!-- Galeria de mídia (US011) -->
      <MediaGallery v-if="event.media?.length" :media="event.media" class="mb-6" />
      <div v-else class="w-full h-64 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-purple mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna principal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Cabeçalho do evento -->
          <div>
            <div class="flex flex-wrap items-start justify-between gap-3 mb-2">
              <CategoryTag :category="event.category" />
              <button
                class="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border transition-colors"
                :class="event.isFavorite
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'"
                :aria-label="event.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                :disabled="favoriteLoading"
                @click="toggleFavorite"
              >
                <Heart
                  :size="16"
                  :fill="event.isFavorite ? 'currentColor' : 'none'"
                  :class="event.isFavorite ? 'text-red-400' : 'text-gray-300'"
                />
                {{ event.isFavorite ? 'Favoritado' : 'Favoritar' }}
              </button>
            </div>

            <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">{{ event.title }}</h1>

            <div v-if="event.avgRating > 0" class="flex items-center gap-2 mb-3">
              <StarRating :value="event.avgRating" size="sm" />
              <span class="text-sm text-gray-400">{{ event.avgRating.toFixed(1) }} · {{ event.reviewCount }} avaliações</span>
            </div>

            <p class="text-gray-300 leading-relaxed">{{ event.description }}</p>
          </div>

          <!-- Informações do evento -->
          <div class="bg-brand-card rounded-2xl p-5 space-y-4">
            <h2 class="font-semibold text-white">Detalhes</h2>

            <div class="flex items-start gap-3 text-sm">
              <Clock :size="16" class="text-brand-purple mt-0.5 shrink-0" />
              <div>
                <p class="text-white">{{ formatDate(event.startDate) }}</p>
                <p v-if="event.startTime" class="text-gray-400">
                  {{ event.startTime }}{{ event.endTime ? ` – ${event.endTime}` : '' }}
                </p>
                <p v-if="event.endDate && event.endDate !== event.startDate" class="text-gray-400 text-xs mt-0.5">
                  Até {{ formatDate(event.endDate) }}
                </p>
              </div>
            </div>

            <div v-if="event.venue" class="flex items-start gap-3 text-sm">
              <MapPin :size="16" class="text-brand-purple mt-0.5 shrink-0" />
              <div>
                <p class="text-white">{{ event.venue.name }}</p>
                <p class="text-gray-400">{{ event.venue.address }}, {{ event.venue.city }} – {{ event.venue.state }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <Ticket :size="16" class="text-brand-purple shrink-0" />
              <span class="text-white">
                {{ event.isFree ? 'Gratuito' : `R$ ${Number(event.ticketPrice).toFixed(2).replace('.', ',')}` }}
              </span>
            </div>

            <div v-if="event.capacity" class="flex items-center gap-3 text-sm">
              <Users :size="16" class="text-brand-purple shrink-0" />
              <span class="text-gray-300">Capacidade: {{ event.capacity }} pessoas</span>
            </div>
          </div>

          <!-- Avaliações (US013) -->
          <ReviewsPanel
            :event-id="eventId"
            :summary="summary"
            @refresh="fetchData"
          />
        </div>

        <!-- Sidebar: mapa (US012) -->
        <div class="space-y-4">
          <MapWidget
            v-if="event.venue?.latitude && event.venue?.longitude"
            :latitude="event.venue.latitude"
            :longitude="event.venue.longitude"
            :venue-name="event.venue.name"
          />

          <div v-if="event.highlightTag" class="bg-brand-purple/20 border border-brand-purple/30 rounded-xl px-4 py-3">
            <span class="text-brand-purple font-medium text-sm">{{ event.highlightTag }}</span>
          </div>
        </div>
      </div>
    </template>

    <AuthModal v-model="showAuthModal" />
  </div>
</template>
