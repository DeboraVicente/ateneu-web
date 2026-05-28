<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { LogIn, LogOut, User } from 'lucide-vue-next'
import SearchBar from '@/components/search/SearchBar.vue'

const authStore = useAuthStore()
const router = useRouter()

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-brand-dark/90 backdrop-blur-md border-b border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex-shrink-0 text-xl font-bold text-white tracking-tight">
        <span class="text-brand-purple">A</span>teneu
      </RouterLink>

      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-6 ml-4" aria-label="Navegação principal">
        <RouterLink to="/" class="text-sm text-gray-400 hover:text-white transition-colors" active-class="text-white">Início</RouterLink>
        <RouterLink to="/agenda" class="text-sm text-gray-400 hover:text-white transition-colors" active-class="text-white">Agenda</RouterLink>
        <RouterLink to="/busca" class="text-sm text-gray-400 hover:text-white transition-colors" active-class="text-white">Busca</RouterLink>
      </nav>

      <!-- SearchBar -->
      <div class="flex-1 max-w-md mx-4 hidden sm:block">
        <SearchBar />
      </div>

      <!-- Auth -->
      <div class="ml-auto flex items-center gap-2">
        <template v-if="authStore.isAuthenticated">
          <span class="hidden sm:flex items-center gap-2 text-sm text-gray-300">
            <User :size="16" />
            {{ authStore.user?.firstName }}
          </span>
          <button
            class="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Sair"
            @click="logout"
          >
            <LogOut :size="18" />
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <LogIn :size="16" />
            Entrar
          </RouterLink>
          <RouterLink
            to="/cadastro"
            class="text-sm bg-brand-purple hover:bg-brand-purple-light text-white px-4 py-2 rounded-xl transition-colors"
          >
            Cadastrar
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
