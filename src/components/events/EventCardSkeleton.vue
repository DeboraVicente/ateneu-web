<script setup lang="ts">
defineProps<{ variant?: 'grid' | 'list' | 'mini' }>()
</script>

<template>
  <!-- Grid skeleton -->
  <div v-if="variant === 'grid' || !variant" class="bg-brand-card rounded-2xl overflow-hidden animate-pulse">
    <div class="aspect-[4/3] bg-white/10" />
    <div class="p-4 space-y-2">
      <div class="h-4 bg-white/10 rounded w-3/4" />
      <div class="h-3 bg-white/10 rounded w-1/2" />
      <div class="h-3 bg-white/10 rounded w-1/3" />
    </div>
  </div>

  <!-- List skeleton -->
  <div v-else-if="variant === 'list'" class="flex gap-4 bg-brand-card rounded-2xl p-3 animate-pulse">
    <div class="w-24 h-24 flex-shrink-0 rounded-xl bg-white/10" />
    <div class="flex-1 space-y-2 py-1">
      <div class="h-4 bg-white/10 rounded w-3/4" />
      <div class="h-3 bg-white/10 rounded w-1/2" />
      <div class="h-3 bg-white/10 rounded w-1/4" />
    </div>
  </div>

  <!-- Mini skeleton -->
  <div v-else-if="variant === 'mini'" class="bg-brand-card rounded-xl overflow-hidden animate-pulse">
    <div class="aspect-video bg-white/10" />
    <div class="p-3 space-y-2">
      <div class="h-3 bg-white/10 rounded w-3/4" />
      <div class="h-3 bg-white/10 rounded w-1/2" />
      <div class="h-7 bg-white/10 rounded" />
    </div>
  </div>
</template>
