import { ref } from 'vue';

export type GeolocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error' | 'timeout';

export interface Coords {
  lat: number;
  lng: number;
}

// Composable puro de geolocalização do navegador. Não dispara sozinho ao montar —
// só quando `request()` é chamado (nunca interromper o carregamento da página com
// o prompt de permissão). Quem chama decide o fallback em caso de negação/erro;
// isso aqui só resolve as coordenadas ou null.
export function useGeolocation() {
  const status = ref<GeolocationStatus>('idle');
  const coords  = ref<Coords | null>(null);

  function request(): Promise<Coords | null> {
    return new Promise(resolve => {
      if (!navigator.geolocation) {
        status.value = 'error';
        resolve(null);
        return;
      }

      status.value = 'requesting';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = { lat: position.coords.latitude, lng: position.coords.longitude };
          coords.value = next;
          status.value = 'granted';
          resolve(next);
        },
        (err) => {
          status.value = err.code === err.TIMEOUT ? 'timeout' : 'denied';
          resolve(null);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
      );
    });
  }

  return { status, coords, request };
}
