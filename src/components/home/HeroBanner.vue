<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { HighlightEvent } from '@/types/event'

const props = defineProps<{ highlights: HighlightEvent[]; loading: boolean }>()
const router = useRouter()
const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval>

function next() { currentIndex.value = (currentIndex.value + 1) % props.highlights.length }
function prev() { currentIndex.value = (currentIndex.value - 1 + props.highlights.length) % props.highlights.length }

function resetTimer() {
  clearInterval(timer)
  timer = setInterval(next, 5000)
}

onMounted(() => { if (props.highlights.length > 1) resetTimer() })
onUnmounted(() => clearInterval(timer))

const current = () => props.highlights[currentIndex.value]
</script>

<template>
  <!-- Skeleton -->
  <div v-if="loading" class="relative h-[420px] md:h-[520px] rounded-2xl overflow-hidden animate-pulse bg-white/10" />

  <section
    v-else-if="highlights.length"
    class="relative h-[420px] md:h-[520px] rounded-2xl overflow-hidden"
    aria-label="Destaques da semana"
  >
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-purple transition-all duration-700"
      :style="current()?.coverImage ? `background-image: url(${current()?.coverImage}); background-size: cover; background-position: center;` : ''"
    />
    <!-- Overlay gradiente -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

    <!-- Conteúdo -->
    <div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
      <span v-if="current()?.highlightTag" class="inline-block mb-3 text-xs font-semibold tracking-widest uppercase bg-brand-purple px-3 py-1 rounded-full">
        {{ current()?.highlightTag }}
      </span>
      <h1 class="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">{{ current()?.title }}</h1>
      <p class="text-gray-300 text-sm md:text-base mb-5 max-w-xl line-clamp-2">{{ current()?.shortDescription }}</p>
      <button
        class="bg-brand-purple hover:bg-brand-purple-light text-white font-medium px-6 py-3 rounded-xl transition-colors"
        @click="router.push(`/eventos/${current()?.id}`)"
      >
        Ver Detalhes
      </button>
    </div>

    <!-- Controles (apenas se > 1) -->
    <template v-if="highlights.length > 1">
      <div class="absolute top-4 right-4 flex gap-2">
        <button
          class="p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
          aria-label="Destaque anterior"
          @click="prev(); resetTimer()"
        >
          <ChevronLeft :size="20" class="text-white" />
        </button>
        <button
          class="p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
          aria-label="Próximo destaque"
          @click="next(); resetTimer()"
        >
          <ChevronRight :size="20" class="text-white" />
        </button>
      </div>

      <!-- Dots -->
      <div class="absolute bottom-4 right-6 flex gap-1.5">
        <button
          v-for="(_, i) in highlights"
          :key="i"
          class="h-1.5 rounded-full transition-all duration-300"
          :class="i === currentIndex ? 'bg-white w-5' : 'bg-white/40 w-1.5'"
          :aria-label="`Ir para destaque ${i + 1}`"
          @click="currentIndex = i; resetTimer()"
        />
      </div>
    </template>
  </section>
</template>
