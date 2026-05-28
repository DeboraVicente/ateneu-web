<script setup lang="ts">
import { useRouter } from 'vue-router'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()
function onSuccess() { router.push('/') }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-2">Criar conta</h1>
      <p class="text-gray-400 text-center mb-8">Junte-se ao Ateneu de Campinas</p>
      <div class="bg-brand-card rounded-2xl p-6">
        <RegisterForm @success="onSuccess" />
      </div>
      <p class="text-center text-gray-400 text-sm mt-4">
        Já tem conta?
        <RouterLink to="/login" class="text-brand-purple hover:underline">Entrar</RouterLink>
      </p>
    </div>
  </div>
</template>
