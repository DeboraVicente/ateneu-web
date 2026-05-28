<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const tab = ref<'login' | 'register'>('login')

function close() { emit('update:modelValue', false) }
function onSuccess() { close() }
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Fazer login ou criar conta"
      @click.self="close"
    >
      <div class="bg-brand-card w-full max-w-md rounded-2xl p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Acesse sua conta</h2>
          <button class="p-1 hover:bg-white/10 rounded-lg transition-colors" aria-label="Fechar modal" @click="close">
            <X :size="20" />
          </button>
        </div>

        <div class="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
          <button
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="tab === 'login' ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'"
            @click="tab = 'login'"
          >Entrar</button>
          <button
            class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="tab === 'register' ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'"
            @click="tab = 'register'"
          >Criar conta</button>
        </div>

        <LoginForm v-if="tab === 'login'" @success="onSuccess" />
        <RegisterForm v-else @success="onSuccess" />
      </div>
    </div>
  </Teleport>
</template>
