<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :target="href ? target : undefined"
    :type="tag === 'button' ? type : undefined"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    class="app-btn"
    :class="[variant === 'ghost' ? 'btn-ghost' : 'btn-primary', { 'app-btn-block': block, 'app-btn-sm': size === 'sm' }]"
  >
    <span v-if="loading" class="spinner" />
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, type RouteLocationRaw } from 'vue-router';

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost';
  size?: 'md' | 'sm';
  to?: RouteLocationRaw;
  href?: string;
  target?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
});

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'));
</script>

<style scoped>
.app-btn {
  gap: 8px;
  text-decoration: none;
}
.app-btn-block { display: flex; width: 100%; }
.app-btn-sm { padding: 8px 18px; font-size: 13px; }

.spinner {
  width: 15px; height: 15px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
  animation: spin .6s linear infinite; flex-shrink: 0;
}
.btn-ghost .spinner { border-color: var(--border); border-top-color: var(--purple); }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
