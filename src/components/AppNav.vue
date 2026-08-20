<template>
  <nav class="app-nav">
    <!-- Logo -->
    <RouterLink to="/" class="nav-logo">
      <img :src="logoUrl" alt="Ateneu" />
    </RouterLink>

    <!-- Nav links -->
    <div class="nav-links">
      <RouterLink class="nav-link" to="/" exact-active-class="active">Descobrir</RouterLink>
      <RouterLink class="nav-link" to="/mapa"      active-class="active">Mapa</RouterLink>
      <RouterLink class="nav-link" to="/calendario" active-class="active">Calendário</RouterLink>
      <RouterLink v-if="auth.isAuth" class="nav-link" to="/favoritos" active-class="active">Favoritos</RouterLink>
    </div>

    <!-- Auth -->
    <template v-if="auth.isAuth">
      <div class="nav-avatar" @click="showMenu = !showMenu">
        {{ auth.initials }}
      </div>
      <transition name="dropdown">
        <div v-if="showMenu" class="user-menu">
          <div class="user-menu-header">
            <div class="user-menu-name">{{ auth.fullName }}</div>
            <div class="user-menu-email">{{ auth.user?.email }}</div>
          </div>
          <RouterLink to="/favoritos" class="user-menu-item" @click="showMenu = false"><Heart :size="15" /> Favoritos</RouterLink>
          <button class="user-menu-item danger" @click="logout"><LogOut :size="15" /> Sair</button>
        </div>
      </transition>
    </template>
    <template v-else>
      <AppButton to="/auth" size="sm">Entrar</AppButton>
    </template>
  </nav>

  <!-- Category bar — mesmo padrão visual em Descobrir, Mapa e Calendário, filtrando
       o dado relevante de cada página (locais nas duas primeiras, eventos na terceira) -->
  <div v-if="showCatBar" class="cat-bar">
    <button
      v-for="cat in categories"
      :key="cat.value"
      class="pill"
      :class="{ active: activeCategory === cat.value }"
      @click="toggleCategory(cat.value)"
    >
      <component :is="categoryIcon(cat.value)" :size="14" />
      {{ cat.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Heart, LogOut } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth.store';
import { usePlacesStore } from '@/stores/places.store';
import { useEventsStore } from '@/stores/events.store';
import { categoryIcon } from '@/lib/categoryIcons';
import AppButton from './AppButton.vue';
import logoUrl from '@/assets/logo-ateneu.svg';

const auth        = useAuthStore();
const placesStore = usePlacesStore();
const eventsStore = useEventsStore();
const route       = useRoute();
const router      = useRouter();

const showMenu    = ref(false);

const categories = [
  { value: '',            label: 'Tudo' },
  { value: 'CINEMA',      label: 'Cinema' },
  { value: 'TEATRO',      label: 'Teatro' },
  { value: 'SHOWS',       label: 'Shows' },
  { value: 'MUSEU',       label: 'Museus' },
  { value: 'PARQUE',      label: 'Parques' },
  { value: 'EXPOSICAO',   label: 'Exposições' },
  { value: 'IGREJA',      label: 'Igrejas' },
  { value: 'FEIRA',       label: 'Feiras' },
  { value: 'AR_LIVRE',    label: 'Ar Livre' },
];

const showCatBar   = computed(() => ['/', '/mapa', '/calendario'].includes(route.path));
const isCalendar   = computed(() => route.path === '/calendario');
const activeCategory = computed(() => isCalendar.value ? eventsStore.filters.category : placesStore.filters.category);

function toggleCategory(val: string) {
  if (isCalendar.value) {
    eventsStore.setFilter('category', eventsStore.filters.category === val ? '' : val);
  } else {
    placesStore.setFilter('category', placesStore.filters.category === val ? '' : val);
  }
}

function logout() {
  auth.logout();
  showMenu.value = false;
  router.push('/auth');
}
</script>

<style scoped>
.app-nav {
  position: sticky; top: 0; z-index: 900;
  display: flex; align-items: center; gap: 16px;
  padding: 0 40px; height: 64px;
  background: rgba(255,255,255,.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border2);
}

.nav-logo {
  display: flex; align-items: center;
  flex-shrink: 0;
}
.nav-logo img { height: 44px; width: auto; }

.nav-links {
  display: flex; align-items: center; gap: 2px; margin-left: auto;
}
.nav-link {
  padding: 7px 13px; border-radius: 50px;
  font-size: 14px; font-weight: 500; color: var(--text2);
  cursor: pointer; transition: .15s; text-decoration: none;
  border: 1px solid transparent;
}
.nav-link:hover { color: var(--text); background: var(--bg2); }
.nav-link.active { color: #fff; background: var(--purple); border-color: var(--purple); }

.nav-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--purple), var(--pink));
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; cursor: pointer; color: #fff;
  border: 2px solid var(--border); transition: .2s; flex-shrink: 0;
}
.nav-avatar:hover { border-color: var(--purple); }

/* User dropdown */
.user-menu {
  position: absolute; top: 60px; right: 40px;
  background: var(--card2); border: 1px solid var(--border);
  border-radius: 14px; padding: 8px; min-width: 200px;
  box-shadow: 0 12px 40px rgba(0,0,0,.4); z-index: 200;
}
.user-menu-header { padding: 8px 10px 12px; border-bottom: 1px solid var(--border2); margin-bottom: 6px; }
.user-menu-name  { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
.user-menu-email { font-size: 12px; color: var(--text2); }
.user-menu-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 9px 10px; border-radius: 8px;
  font-size: 14px; color: var(--text2); cursor: pointer;
  text-decoration: none; background: none; border: none;
  transition: .15s; font-family: 'DM Sans', sans-serif;
}
.user-menu-item:hover { background: var(--bg3); color: var(--text); }
.user-menu-item.danger:hover { color: var(--error); }

/* Category bar */
.cat-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 40px;
  border-bottom: 1px solid var(--border2);
  overflow-x: auto; scrollbar-width: none;
  background: var(--bg);
  transition: background .3s;
}
.cat-bar::-webkit-scrollbar { display: none; }

/* Transitions */
.dropdown-enter-active, .dropdown-leave-active { transition: opacity .2s, transform .2s; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
