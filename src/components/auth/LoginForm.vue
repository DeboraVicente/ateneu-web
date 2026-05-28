<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits<{ success: [] }>()

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.auth.login({ email: email.value, password: password.value })
    authStore.login(data)
    emit('success')
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Erro ao fazer login.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="submit">
    <div>
      <label for="login-email" class="block text-sm text-gray-400 mb-1">E-mail</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors"
        placeholder="seu@email.com"
      />
    </div>
    <div>
      <label for="login-password" class="block text-sm text-gray-400 mb-1">Senha</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors"
        placeholder="••••••••"
      />
    </div>
    <p v-if="error" role="alert" class="text-red-400 text-sm">{{ error }}</p>
    <BaseButton type="submit" variant="primary" :disabled="loading" class="w-full">
      {{ loading ? 'Entrando...' : 'Entrar' }}
    </BaseButton>
  </form>
</template>
