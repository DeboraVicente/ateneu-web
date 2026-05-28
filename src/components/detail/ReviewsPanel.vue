<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { api } from '@/services/api'
import { useAuthGuard } from '@/composables/useAuthGuard'
import { useToast } from 'vue-toastification'
import StarRating from '@/components/ui/StarRating.vue'
import AuthModal from '@/components/auth/AuthModal.vue'
import type { ReviewSummary } from '@/types/review'

const props = defineProps<{ eventId: string; summary: ReviewSummary | null }>()
const emit = defineEmits<{ refresh: [] }>()

const toast = useToast()
const { showAuthModal, requireAuth } = useAuthGuard()

const showReviewModal = ref(false)
const selectedRating = ref(0)
const comment = ref('')
const submitting = ref(false)

function openModal() {
  requireAuth(() => { showReviewModal.value = true })
}

async function submitReview() {
  if (!selectedRating.value) { toast.error('Selecione uma nota.'); return }
  submitting.value = true
  try {
    await api.reviews.post(props.eventId, { rating: selectedRating.value, comment: comment.value })
    toast.success('Avaliação enviada!')
    showReviewModal.value = false
    selectedRating.value = 0
    comment.value = ''
    emit('refresh')
  } catch (e: any) {
    toast.error(e.response?.data?.message ?? 'Erro ao enviar avaliação.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section aria-label="Avaliações">
    <h3 class="font-semibold text-white text-lg mb-4">Avaliações</h3>

    <div v-if="summary && summary.totalReviews > 0" class="flex gap-6 mb-6">
      <!-- Nota macro -->
      <div class="flex flex-col items-center justify-center min-w-[80px]">
        <span class="text-5xl font-bold text-white">{{ summary.avgRating.toFixed(1) }}</span>
        <StarRating :value="summary.avgRating" size="sm" class="mt-1" />
        <span class="text-xs text-gray-400 mt-1">{{ summary.totalReviews }} avaliações</span>
      </div>

      <!-- Barras de distribuição -->
      <div class="flex-1 space-y-1.5">
        <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center gap-2">
          <span class="text-xs text-gray-400 w-4 text-right">{{ star }}</span>
          <span class="text-yellow-400 text-xs">★</span>
          <div class="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              class="h-full bg-brand-purple rounded-full transition-all duration-500"
              :style="`width: ${summary.totalReviews ? ((summary.distribution[star] ?? 0) / summary.totalReviews * 100).toFixed(0) : 0}%`"
            />
          </div>
          <span class="text-xs text-gray-500 w-5">{{ summary.distribution[star] ?? 0 }}</span>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 text-sm mb-4">Nenhuma avaliação ainda. Seja o primeiro!</p>

    <button
      class="bg-brand-purple hover:bg-brand-purple-light text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
      @click="openModal"
    >
      Avaliar Agora
    </button>

    <!-- Modal de avaliação -->
    <Teleport to="body">
      <div
        v-if="showReviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Formulário de avaliação"
        @click.self="showReviewModal = false"
        @keydown.escape="showReviewModal = false"
      >
        <div class="bg-brand-card w-full max-w-md rounded-2xl p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-semibold">Sua avaliação</h3>
            <button class="p-1 hover:bg-white/10 rounded-lg" aria-label="Fechar" @click="showReviewModal = false">
              <X :size="18" />
            </button>
          </div>

          <!-- Seletor de estrelas -->
          <div class="flex gap-2 justify-center mb-4">
            <button
              v-for="n in 5"
              :key="n"
              class="text-3xl transition-transform hover:scale-110 focus-visible:outline-none"
              :aria-label="`${n} estrela${n > 1 ? 's' : ''}`"
              @click="selectedRating = n"
            >
              <span :class="n <= selectedRating ? 'text-yellow-400' : 'text-gray-600'">★</span>
            </button>
          </div>

          <textarea
            v-model="comment"
            rows="3"
            maxlength="500"
            placeholder="Conte o que você achou... (opcional)"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple resize-none text-sm mb-4"
          />

          <button
            class="w-full bg-brand-purple hover:bg-brand-purple-light text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
            :disabled="submitting || !selectedRating"
            @click="submitReview"
          >
            {{ submitting ? 'Enviando...' : 'Enviar Avaliação' }}
          </button>
        </div>
      </div>
    </Teleport>

    <AuthModal v-model="showAuthModal" />
  </section>
</template>
