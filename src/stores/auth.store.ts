import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  const user  = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('ateneu_token'));

  const isAuth  = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'ADMIN');
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  );
  const initials = computed(() =>
    user.value
      ? `${user.value.firstName[0]}${user.value.lastName[0]}`.toUpperCase()
      : '?'
  );

  async function fetchMe() {
    try {
      const { data } = await api.get('/auth/me');
      user.value = data.user;
    } catch {
      logout();
    }
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    token.value = data.token;
    user.value  = data.user;
    localStorage.setItem('ateneu_token',   data.token);
    localStorage.setItem('ateneu_refresh', data.refreshToken);
  }

  async function register(payload: {
    firstName: string; lastName: string; email: string; password: string;
  }) {
    const { data } = await api.post('/auth/register', payload);
    token.value = data.token;
    user.value  = data.user;
    localStorage.setItem('ateneu_token',   data.token);
    localStorage.setItem('ateneu_refresh', data.refreshToken);
  }

  function logout() {
    user.value  = null;
    token.value = null;
    localStorage.removeItem('ateneu_token');
    localStorage.removeItem('ateneu_refresh');
  }

  return { user, token, isAuth, isAdmin, fullName, initials, fetchMe, login, register, logout };
});
