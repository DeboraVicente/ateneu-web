<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import CalendarWidget from '@/components/calendar/CalendarWidget.vue'
import EventDayList from '@/components/calendar/EventDayList.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import type { EventSummary } from '@/types/event'

const authStore = useAuthStore()
const toast = useToast()

const today = new Date().toISOString().split('T')[0] as string
const selectedDate = ref(today)
const hasEventsDates = ref<string[]>([])
const events = ref<EventSummary[]>([])
const loadingEvents = ref(false)
const showAuthModal = ref(false)

async function fetchAvailability(month: number, year: number) {
  try {
    const { data } = await api.calendar.getAvailability(month, year)
    hasEventsDates.value = data.datesWithEvents
  } catch { /* silencioso */ }
}

async function fetchEventsByDate(date: string) {
  loadingEvents.value = true
  try {
    const { data } = await api.events.getAll({ date })
    events.value = data.data
  } finally {
    loadingEvents.value = false
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

watch(selectedDate, fetchEventsByDate)

onMounted(() => {
  const now = new Date()
  fetchAvailability(now.getMonth() + 1, now.getFullYear())
  fetchEventsByDate(today)
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
    <h1 class="text-2xl font-bold text-white mb-6">Agenda</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Coluna principal -->
      <div class="lg:col-span-2 space-y-6">
        <!-- US008: Calendário interativo -->
        <CalendarWidget
          v-model="selectedDate"
          :has-events-dates="hasEventsDates"
          @month-change="({ month, year }) => fetchAvailability(month, year)"
        />

        <!-- US009: Eventos do dia selecionado -->
        <EventDayList
          :selected-date="selectedDate"
          :events="events"
          :loading="loadingEvents"
          @toggle-favorite="handleToggleFavorite"
        />
      </div>

      <!-- US010: Sidebar com destaques -->
      <div class="hidden lg:block">
        <AppSidebar />
      </div>
    </div>

    <AuthModal v-model="showAuthModal" />
  </div>
</template>
