<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import type { EventMedia } from '@/types/event'

const props = defineProps<{ media: EventMedia[] }>()

const lightboxSrc = ref<string | null>(null)

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
  img.parentElement!.classList.add('bg-gradient-to-br', 'from-brand-dark', 'to-brand-purple')
}
</script>

<template>
  <div>
    <!-- Mosaico: 1 grande + 2 pequenas -->
    <div
      class="grid gap-2 rounded-2xl overflow-hidden"
      :class="media.length >= 3 ? 'grid-cols-3 grid-rows-2' : 'grid-cols-1'"
    >
      <!-- Imagem principal (grande, ocupa 2 linhas) -->
      <div
        class="relative overflow-hidden cursor-pointer"
        :class="media.length >= 3 ? 'col-span-2 row-span-2' : ''"
        style="min-height: 280px"
        @click="lightboxSrc = media[0]?.url ?? null"
      >
        <img
          v-if="media[0]"
          :src="media[0].url"
          :alt="media[0].altText || 'Foto principal do evento'"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="eager"
          @error="onImageError"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-brand-dark to-brand-purple" />
      </div>

      <!-- 2 imagens menores (direita) -->
      <template v-if="media.length >= 3">
        <div
          v-for="img in media.slice(1, 3)"
          :key="img.id"
          class="relative overflow-hidden cursor-pointer"
          @click="lightboxSrc = img.url"
        >
          <img
            :src="img.url"
            :alt="img.altText || 'Foto do evento'"
            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            @error="onImageError"
          />
        </div>
      </template>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxSrc"
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Visualização de imagem"
        @click.self="lightboxSrc = null"
        @keydown.escape="lightboxSrc = null"
      >
        <button
          class="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Fechar"
          @click="lightboxSrc = null"
        >
          <X :size="20" class="text-white" />
        </button>
        <img :src="lightboxSrc" alt="Imagem ampliada" class="max-w-full max-h-[90vh] rounded-xl object-contain" />
      </div>
    </Teleport>
  </div>
</template>
