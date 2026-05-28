<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type * as L from 'leaflet'

const props = defineProps<{ latitude: number; longitude: number; venueName: string }>()

const mapContainer = ref<HTMLDivElement>()
let mapInstance: L.Map | null = null

onMounted(async () => {
  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')

  // Corrige o caminho dos ícones padrão do Leaflet no Vite
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  mapInstance = L.map(mapContainer.value!).setView([props.latitude, props.longitude], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(mapInstance)

  L.marker([props.latitude, props.longitude])
    .addTo(mapInstance)
    .bindPopup(`<strong>${props.venueName}</strong>`)
    .openPopup()
})

onUnmounted(() => mapInstance?.remove())
</script>

<template>
  <div>
    <h3 class="font-semibold text-white mb-3">Localização</h3>
    <div
      ref="mapContainer"
      class="h-64 w-full rounded-xl overflow-hidden border border-white/10"
      aria-label="Mapa de localização do evento"
    />
    <p class="text-sm text-gray-400 mt-2">{{ venueName }}</p>
  </div>
</template>
