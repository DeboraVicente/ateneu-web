<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'icon' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'bg-brand-purple hover:bg-brand-purple-light text-white px-6 py-3': variant === 'primary' || !variant,
      'border border-brand-purple text-brand-purple hover:bg-brand-purple/10 px-6 py-3': variant === 'secondary',
      'p-2 rounded-full hover:bg-white/10': variant === 'icon',
      'text-gray-300 hover:text-white hover:bg-white/5 px-4 py-2': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
