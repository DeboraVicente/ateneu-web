import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import { useToast } from 'vue-toastification'
import type { EventSummary } from '@/types/event'

export function useEventFavorite(event: EventSummary) {
  const authStore = useAuthStore()
  const toast = useToast()
  const showAuthModal = ref(false)

  async function toggleFavorite() {
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

  return { toggleFavorite, showAuthModal }
}
