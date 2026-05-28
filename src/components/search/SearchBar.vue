<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { useDebounceFn, onClickOutside } from '@vueuse/core'
import { api } from '@/services/api'
import type { EventSummary } from '@/types/event'

const router = useRouter()
const query = ref('')
const suggestions = ref<Pick<EventSummary, 'id' | 'title' | 'category' | 'coverImage'>[]>([])
const showDropdown = ref(false)
const container = ref<HTMLElement>()

onClickOutside(container, () => (showDropdown.value = false))

const fetchSuggestions = useDebounceFn(async (q: string) => {
  if (q.length < 2) { suggestions.value = []; return }
  try {
    const { data } = await api.search.getSuggestions(q)
    suggestions.value = data
    showDropdown.value = data.length > 0
  } catch { suggestions.value = [] }
}, 300)

watch(query, fetchSuggestions)

function navigate() {
  if (!query.value.trim()) return
  showDropdown.value = false
  router.push({ path: '/busca', query: { q: query.value } })
}

function selectSuggestion(id: string) {
  showDropdown.value = false
  router.push(`/eventos/${id}`)
}
</script>

<template>
  <div ref="container" class="relative w-full">
    <label for="search-input" class="sr-only">O que você quer fazer hoje?</label>
    <div class="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-brand-purple transition-colors">
      <input
        id="search-input"
        v-model="query"
        type="search"
        role="combobox"
        :aria-expanded="showDropdown"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        class="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
        placeholder="O que você quer fazer hoje?"
        @keydown.enter="navigate"
        @focus="showDropdown = suggestions.length > 0"
      />
      <button aria-label="Pesquisar" class="text-gray-400 hover:text-white transition-colors" @click="navigate">
        <Search :size="16" />
      </button>
    </div>

    <ul
      v-if="showDropdown && suggestions.length"
      id="search-suggestions"
      role="listbox"
      class="absolute top-full left-0 right-0 mt-1 bg-brand-card border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
    >
      <li
        v-for="s in suggestions"
        :key="s.id"
        role="option"
        class="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
        @click="selectSuggestion(s.id)"
      >
        <img :src="s.coverImage" :alt="s.title" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" loading="lazy" />
        <div>
          <p class="text-sm text-white">{{ s.title }}</p>
          <p class="text-xs text-gray-400 capitalize">{{ s.category }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
