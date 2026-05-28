<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
function onSuccess() { router.push('/') }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-2">Bem-vindo de volta</h1>
      <p class="text-gray-400 text-center mb-8">Entre na sua conta para continuar</p>
      <div class="bg-brand-card rounded-2xl p-6">
        <LoginForm @success="onSuccess" />
      </div>
      <p class="text-center text-gray-400 text-sm mt-4">
        Não tem conta?
        <RouterLink to="/cadastro" class="text-brand-purple hover:underline">Criar conta</RouterLink>
      </p>
    </div>
  </div>
</template>
