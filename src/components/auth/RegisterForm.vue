<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'

const emit = defineEmits<{ success: [] }>()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await api.auth.register({ firstName: firstName.value, lastName: lastName.value, email: email.value, password: password.value })
    const { data } = await api.auth.login({ email: email.value, password: password.value })
    authStore.login(data)
    emit('success')
  } catch (e: any) {
    error.value = e.response?.data?.message ?? 'Erro ao criar conta.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="submit">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label for="reg-first" class="block text-sm text-gray-400 mb-1">Nome</label>
        <input id="reg-first" v-model="firstName" type="text" required
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          placeholder="Nome" />
      </div>
      <div>
        <label for="reg-last" class="block text-sm text-gray-400 mb-1">Sobrenome</label>
        <input id="reg-last" v-model="lastName" type="text" required
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          placeholder="Sobrenome" />
      </div>
    </div>
    <div>
      <label for="reg-email" class="block text-sm text-gray-400 mb-1">E-mail</label>
      <input id="reg-email" v-model="email" type="email" required autocomplete="email"
        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
        placeholder="seu@email.com" />
    </div>
    <div>
      <label for="reg-pass" class="block text-sm text-gray-400 mb-1">Senha</label>
      <input id="reg-pass" v-model="password" type="password" required autocomplete="new-password"
        class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
        placeholder="Mínimo 6 caracteres" />
    </div>
    <p v-if="error" role="alert" class="text-red-400 text-sm">{{ error }}</p>
    <BaseButton type="submit" variant="primary" :disabled="loading" class="w-full">
      {{ loading ? 'Criando conta...' : 'Criar conta' }}
    </BaseButton>
  </form>
</template>
