import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuthGuard() {
  const authStore = useAuthStore()
  const showAuthModal = ref(false)

  function requireAuth(callback: () => void) {
    if (!authStore.isAuthenticated) {
      showAuthModal.value = true
      return
    }
    callback()
  }

  return { showAuthModal, requireAuth }
}
