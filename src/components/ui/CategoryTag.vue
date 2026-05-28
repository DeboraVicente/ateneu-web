<script setup lang="ts">
import { CATEGORY_LABELS } from '@/types/event'
import type { EventCategory } from '@/types/event'

defineProps<{ category: EventCategory }>()
</script>

<template>
  <span class="text-xs font-semibold tracking-widest uppercase bg-brand-purple/80 text-white px-2 py-1 rounded">
    {{ CATEGORY_LABELS[category] }}
  </span>
</template>
