<template>
  <main style="min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; text-align: center; padding: 40px;">
    <div>
      <Compass style="color: var(--border); margin-bottom: 20px;" :size="72" />
      <h1 style="font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 10px;">404 — Página não encontrada</h1>
      <p style="color: var(--text2); margin-bottom: 28px;">Esta rota não existe no guia cultural.</p>
      <AppButton to="/">Voltar ao início</AppButton>
    </div>
  </main>
</template>

<script setup lang="ts">
import { Compass } from 'lucide-vue-next';
import AppButton from '@/components/AppButton.vue';
</script>
