<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-brand-dark">
    <AppHeader />
    <main>
      <RouterView />
    </main>
  </div>
</template>
