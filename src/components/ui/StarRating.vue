<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ value: number; max?: number; size?: 'sm' | 'md' }>()

const stars = computed(() =>
  Array.from({ length: props.max ?? 5 }, (_, i) => ({
    filled: i < Math.round(props.value),
    partial: i === Math.floor(props.value) && props.value % 1 >= 0.5,
  })),
)
</script>

<template>
  <div class="flex items-center gap-0.5" :aria-label="`${value} de ${max ?? 5} estrelas`">
    <span
      v-for="(star, i) in stars"
      :key="i"
      :class="[
        star.filled ? 'text-yellow-400' : 'text-gray-600',
        size === 'sm' ? 'text-sm' : 'text-base',
      ]"
      aria-hidden="true"
    >★</span>
  </div>
</template>
