<!-- MapView.vue -->
<template>
  <main class="map-page">
    <!-- Sidebar -->
    <div class="map-sidebar">
      <div class="map-search">
        <Search class="search-icon-sm" :size="13" />
        <input v-model="search" type="text" placeholder="Buscar local ou endereço..." class="input-base" style="padding-left: 36px;" @input="onSearch"/>
      </div>

      <div class="map-cat-pills">
        <button v-for="cat in categories" :key="cat.value" class="pill" :class="{ active: activeCategory === cat.value }" @click="setCategory(cat.value)">
          <component :is="categoryIcon(cat.value)" :size="14" /> {{ cat.label }}
        </button>
      </div>

      <!-- Em cartaz no cinema — só quando filtrando por Cinema -->
      <div v-if="placesStore.filters.category === 'CINEMA'" class="map-movies">
        <div class="map-movies-header">Em cartaz no cinema</div>
        <div v-if="moviesStore.loading" class="loading-text">Carregando...</div>
        <div v-else class="movies-row">
          <MovieCard v-for="movie in moviesStore.items" :key="movie.id" :movie="movie" />
        </div>
      </div>

      <!-- Results list -->
      <div class="map-results">
        <div v-if="placesStore.loading" class="loading-text">Carregando...</div>
        <div
          v-for="place in placesStore.items"
          :key="place.id"
          class="map-result-item"
          :class="{ active: selectedPlace?.id === place.id }"
          @click="selectPlace(place)"
        >
          <component :is="categoryIcon(place.category)" class="result-icon" :size="20" />
          <div class="result-info">
            <div class="result-name">{{ place.name }}</div>
            <div class="result-addr">
              {{ place.address }}
              <span v-if="place.distanceKm !== undefined"> — {{ place.distanceKm }} km</span>
            </div>
          </div>
          <div class="result-tag" :class="`tag tag-${place.category}`">{{ LABEL[place.category] }}</div>
        </div>
      </div>
    </div>

    <!-- Map area -->
    <div class="map-area">
      <!-- Ações do mapa (categorias já ficam na sidebar, não repetir aqui) -->
      <div class="map-top-actions">
        <select v-model.number="radiusKm" class="radius-select" title="Raio de busca">
          <option :value="5">5 km</option>
          <option :value="10">10 km</option>
          <option :value="20">20 km</option>
        </select>
        <button class="nearby-btn" :disabled="geo.status.value === 'requesting'" @click="findNearby">
          <LocateFixed :size="13" /> {{ geo.status.value === 'requesting' ? 'Localizando...' : 'Perto de mim' }}
        </button>
        <button class="suggest-btn"><MapPin :size="13" /> Sugerir Local</button>
      </div>

      <transition name="fade">
        <div v-if="nearbyMessage" class="nearby-msg">{{ nearbyMessage }}</div>
      </transition>

      <!-- Mapa real (Leaflet + tiles do OpenStreetMap) -->
      <div class="map-canvas" ref="mapEl"></div>

      <!-- Selected popup -->
      <transition name="popup">
        <div v-if="selectedPlace" class="map-popup">
          <button class="popup-close" @click="selectedPlace = null"><X :size="12" /></button>
          <div class="popup-thumb" :class="`thumb-${selectedPlace.category}`">
            <component :is="categoryIcon(selectedPlace.category)" :size="28" />
          </div>
          <div class="popup-body">
            <span class="popup-tag" :class="`tag tag-${selectedPlace.category}`">{{ LABEL[selectedPlace.category] }}</span>
            <div class="popup-name">{{ selectedPlace.name }}</div>
            <div class="popup-addr"><MapPin :size="13" /> {{ selectedPlace.address }}</div>
            <div v-if="selectedPlace.isFree" class="popup-free"><Check :size="13" /> Entrada gratuita</div>
            <AppButton :to="`/local/${selectedPlace.id}`" size="sm" block style="margin-top:10px;">
              Ver Detalhes
            </AppButton>
          </div>
        </div>
      </transition>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, createApp, h } from 'vue';
import L from '@/lib/leaflet';
import 'leaflet.markercluster';
import { Search, MapPin, X, Check, LocateFixed } from 'lucide-vue-next';
import { usePlacesStore } from '@/stores/places.store';
import { useMoviesStore } from '@/stores/movies.store';
import { categoryIcon } from '@/lib/categoryIcons';
import { categoryColor } from '@/lib/categoryColors';
import { useGeolocation } from '@/composables/useGeolocation';
import AppButton from '@/components/AppButton.vue';
import MovieCard from '@/components/MovieCard.vue';
import type { Place } from '@/stores/places.store';

const CAMPINAS = { lat: -22.9099, lng: -47.0626 };

const placesStore    = usePlacesStore();
const moviesStore    = useMoviesStore();
const search         = ref('');
const activeCategory = ref(placesStore.filters.category);
const selectedPlace  = ref<Place | null>(null);
const mapEl          = ref<HTMLDivElement | null>(null);
const radiusKm       = ref(10);
const nearbyMessage  = ref('');

const geo = useGeolocation();

let map: L.Map | null = null;
let clusterGroup: L.MarkerClusterGroup | null = null;

const LABEL: Record<string,string> = { CINEMA:'Cinema', TEATRO:'Teatro', SHOWS:'Shows', GASTRONOMIA:'Gastronomia', MUSEU:'Museu', PARQUE:'Parque', IGREJA:'Igreja', FEIRA:'Feira', EXPOSICAO:'Exposição', AR_LIVRE:'Ar Livre', OUTRO:'Local' };

const categories = [
  { value: '',            label: 'Todos' },
  { value: 'MUSEU',       label: 'Museus' },
  { value: 'SHOWS',       label: 'Shows' },
  { value: 'TEATRO',      label: 'Teatros' },
  { value: 'PARQUE',      label: 'Parques' },
  { value: 'EXPOSICAO',   label: 'Exposições' },
  { value: 'CINEMA',      label: 'Cinemas' },
  { value: 'IGREJA',      label: 'Igrejas' },
  { value: 'FEIRA',       label: 'Feiras' },
  { value: 'AR_LIVRE',    label: 'Ar Livre' },
  { value: 'OUTRO',       label: 'Outros' },
];

// Cache do HTML (SVG) de cada ícone de categoria — evita remontar o mesmo
// componente Vue centenas de vezes ao desenhar os marcadores do mapa.
const iconHtmlCache = new Map<string, string>();
function iconToHtml(category: string): string {
  const cached = iconHtmlCache.get(category);
  if (cached) return cached;
  const container = document.createElement('div');
  const tmpApp = createApp({ render: () => h(categoryIcon(category), { size: 16, color: '#fff' }) });
  tmpApp.mount(container);
  const html = container.innerHTML;
  tmpApp.unmount();
  iconHtmlCache.set(category, html);
  return html;
}

function buildDivIcon(place: Place) {
  const color = categoryColor(place.category);
  return L.divIcon({
    html: `<div class="ateneu-pin" style="background:${color};--pin-color:${color}">${iconToHtml(place.category)}</div>`,
    className: 'ateneu-pin-wrap',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

function renderMarkers() {
  if (!clusterGroup) return;
  clusterGroup.clearLayers();
  for (const place of placesStore.items) {
    if (typeof place.lat !== 'number' || typeof place.lng !== 'number') continue;
    const marker = L.marker([place.lat, place.lng], { icon: buildDivIcon(place) });
    marker.on('click', () => { selectedPlace.value = place; });
    clusterGroup.addLayer(marker);
  }
}

watch(() => placesStore.items, renderMarkers);

onMounted(async () => {
  // O clustering absorve o custo de renderizar muitos pinos, então busca bem mais
  // que os 20 padrão para o mapa dar uma ideia real da cobertura de Campinas.
  placesStore.filters.limit = 1000;
  await placesStore.fetchPlaces(true);

  await nextTick();
  if (!mapEl.value) return;

  map = L.map(mapEl.value, { zoomControl: true }).setView([CAMPINAS.lat, CAMPINAS.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  clusterGroup = L.markerClusterGroup();
  map.addLayer(clusterGroup);
  renderMarkers();
});

onUnmounted(() => {
  map?.remove();
  map = null;
  clusterGroup = null;
});

let debounce: ReturnType<typeof setTimeout>;
function onSearch() {
  clearTimeout(debounce);
  debounce = setTimeout(() => placesStore.setFilter('search', search.value), 350);
}
function setCategory(val: string) {
  activeCategory.value = val;
  placesStore.setFilter('category', val);
}

// Cobre tanto trocar de categoria aqui no mapa quanto chegar nesta página
// já filtrando por Cinema (ex: vindo da Home).
watch(() => placesStore.filters.category, (category) => {
  if (category === 'CINEMA' && !moviesStore.items.length) {
    moviesStore.fetchNowPlaying();
  }
}, { immediate: true });
function selectPlace(place: Place) {
  selectedPlace.value = place;
  if (map) map.panTo([place.lat, place.lng]);
}

async function findNearby() {
  nearbyMessage.value = '';
  const coords = await geo.request();

  const target = coords ?? CAMPINAS;
  if (!coords) {
    nearbyMessage.value = geo.status.value === 'timeout'
      ? 'Não foi possível obter sua localização a tempo — mostrando locais no centro de Campinas.'
      : 'Localização não permitida — mostrando locais no centro de Campinas.';
  }

  placesStore.setNearby(target.lat, target.lng, radiusKm.value);
  map?.setView([target.lat, target.lng], 14);
}
</script>

<style scoped>
.map-page { display: flex; height: calc(100vh - 64px); overflow: hidden; }

.map-sidebar { width: 320px; flex-shrink: 0; background: var(--bg2); border-right: 1px solid var(--border2); display: flex; flex-direction: column; overflow: hidden; }
.map-search { padding: 14px 16px 10px; position: relative; }
.search-icon-sm { position: absolute; left: 28px; top: 50%; transform: translateY(-50%); color: var(--text3); }
.map-cat-pills { display: flex; gap: 6px; padding: 0 16px 12px; overflow-x: auto; scrollbar-width: none; flex-wrap: wrap; }
.map-cat-pills::-webkit-scrollbar { display: none; }

.map-movies { padding: 0 16px 14px; border-bottom: 1px solid var(--border2); }
.map-movies-header { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; margin-bottom: 10px; }
.movies-row { display: flex; gap: 12px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
.movies-row::-webkit-scrollbar { display: none; }
.movies-row :deep(.movie-card) { flex: 0 0 120px; }
.movies-row :deep(.movie-poster) { height: 170px; }

.map-results { flex: 1; overflow-y: auto; padding: 0 8px 16px; }
.loading-text { padding: 20px; text-align: center; color: var(--text3); font-size: 13px; }
.map-result-item { display: flex; align-items: center; gap: 10px; padding: 10px 10px; border-radius: 10px; cursor: pointer; transition: .15s; margin-bottom: 4px; }
.map-result-item:hover, .map-result-item.active { background: var(--bg3); }
.result-icon { color: var(--text2); flex-shrink: 0; }
.result-info { flex: 1; min-width: 0; }
.result-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text); }
.result-addr { font-size: 11px; color: var(--text3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.result-tag { flex-shrink: 0; }

.map-area { flex: 1; position: relative; }
.map-canvas { width: 100%; height: 100%; position: relative; background: #e5e3df; }

.map-top-actions {
  position: absolute; top: 14px; right: 16px; z-index: 500;
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.92); backdrop-filter: blur(10px);
  border: 1px solid var(--border); border-radius: 50px; padding: 6px;
  box-shadow: 0 4px 16px rgba(0,0,0,.12);
}
.suggest-btn, .nearby-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 50px; font-size: 12px; color: var(--accent); background: var(--card); border: 1px solid var(--border); cursor: pointer; white-space: nowrap; }
.nearby-btn:disabled { opacity: .6; cursor: wait; }
.radius-select { border-radius: 50px; border: 1px solid var(--border); background: var(--card); color: var(--text2); font-size: 12px; padding: 5px 8px; }

.nearby-msg {
  position: absolute; top: 60px; left: 50%; transform: translateX(-50%);
  background: rgba(13,11,20,.9); color: #fff; font-size: 12px;
  padding: 8px 16px; border-radius: 10px; max-width: 360px; text-align: center;
  z-index: 500;
}

.map-popup { position: absolute; top: 20%; left: 45%; background: var(--card2); border: 1px solid var(--border); border-radius: 14px; width: 220px; box-shadow: 0 8px 32px rgba(0,0,0,.6); z-index: 600; overflow: hidden; }
.popup-close { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,.4); border: none; color: #fff; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; z-index: 1; display: flex; align-items: center; justify-content: center; }
.popup-thumb { height: 80px; display: flex; align-items: center; justify-content: center; color: #fff; background: linear-gradient(135deg,#1a0633,#3d1070); }
.popup-body { padding: 12px 14px 14px; }
.popup-tag { display: inline-block; margin-bottom: 5px; }
.popup-name { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.popup-addr { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text2); margin-bottom: 4px; }
.popup-free { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--green); font-weight: 600; }

.popup-enter-active, .popup-leave-active { transition: opacity .2s, transform .2s; }
.popup-enter-from, .popup-leave-to { opacity: 0; transform: scale(.95); }
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<style>
/* Estilos do pino do Leaflet — não podem ser scoped: o Leaflet injeta este HTML
   fora do template do Vue (via divIcon), então o atributo de escopo não se aplica. */
.ateneu-pin-wrap { background: none !important; border: none !important; }
.ateneu-pin {
  width: 34px; height: 34px; border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 10px var(--pin-color, #274B9B);
  border: 2px solid rgba(255,255,255,.85);
  cursor: pointer;
}
.ateneu-pin svg { transform: rotate(45deg); }
</style>
