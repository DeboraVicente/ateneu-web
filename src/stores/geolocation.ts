import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useGeolocation } from '@vueuse/core'

export const useGeolocationStore = defineStore('geolocation', () => {
  const { coords, isSupported } = useGeolocation()
  const city = ref('Campinas')

  return { coords, isSupported, city }
})
