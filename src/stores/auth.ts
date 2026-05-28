import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('ateneu_user') ?? 'null'),
  )
  const token = ref<string | null>(localStorage.getItem('ateneu_token'))

  const isAuthenticated = computed(() => !!token.value)

  function login(payload: { token: string; user: User }) {
    token.value = payload.token
    user.value = payload.user
    localStorage.setItem('ateneu_token', payload.token)
    localStorage.setItem('ateneu_user', JSON.stringify(payload.user))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('ateneu_token')
    localStorage.removeItem('ateneu_user')
  }

  return { user, token, isAuthenticated, login, logout }
})
