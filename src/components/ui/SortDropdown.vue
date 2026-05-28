<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { SORT_LABELS } from '@/types/event'
import type { SortOption } from '@/types/event'

const props = defineProps<{ modelValue: SortOption }>()
const emit = defineEmits<{ 'update:modelValue': [value: SortOption] }>()

const open = ref(false)
const container = ref<HTMLElement>()
onClickOutside(container, () => (open.value = false))

const options: SortOption[] = ['relevance', 'rating', 'upcoming']
</script>

<template>
  <div ref="container" class="relative">
    <button
      class="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <span>Filtrar por: <strong class="text-white">{{ SORT_LABELS[modelValue] }}</strong></span>
      <ChevronDown :size="16" :class="{ 'rotate-180': open }" class="transition-transform" />
    </button>

    <ul
      v-if="open"
      role="listbox"
      class="absolute right-0 top-full mt-2 w-48 bg-brand-card border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden"
    >
      <li
        v-for="opt in options"
        :key="opt"
        role="option"
        :aria-selected="opt === modelValue"
        class="px-4 py-3 text-sm cursor-pointer hover:bg-white/5 transition-colors"
        :class="opt === modelValue ? 'text-brand-purple font-medium' : 'text-gray-300'"
        @click="emit('update:modelValue', opt); open = false"
      >
        {{ SORT_LABELS[opt] }}
      </li>
    </ul>
  </div>
</template>
