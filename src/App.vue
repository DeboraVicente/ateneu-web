<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppNav from './components/AppNav.vue';
</script>

<template>
  <div class="app-layout">
    <AppNav />

    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="main-footer">
      <p>&copy; 2026 Guia Lazer & Cultura - Explore sua cidade.</p>
    </footer>
  </div>
</template>

<style>
/* Estilos globais para o Layout */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
}

.main-content {
  flex: 1; /* Faz o conteúdo ocupar o espaço restante, empurrando o footer para baixo */
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.main-footer {
  text-align: center;
  padding: 20px;
  color: var(--text-muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--border);
}
</style>