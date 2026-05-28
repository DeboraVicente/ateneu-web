import axios from 'axios'
import type { EventsParams, RecommendedParams } from '@/types/event'
import type { LoginPayload, RegisterPayload } from '@/types/auth'
import type { ReviewPayload } from '@/types/review'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

// Anexa JWT em todas as requests
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('ateneu_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 global → limpa sessão
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ateneu_token')
      localStorage.removeItem('ateneu_user')
    }
    return Promise.reject(err)
  },
)

export const api = {
  auth: {
    register: (p: RegisterPayload) => http.post('/api/auth/register', p),
    login: (p: LoginPayload) => http.post('/api/auth/login', p),
  },

  events: {
    getAll: (params: EventsParams) => http.get('/api/ateneu/events', { params }),
    getRecommended: (params: RecommendedParams) => http.get('/api/ateneu/events/recommended', { params }),
    getById: (id: string) => http.get(`/api/ateneu/events/${id}`),
  },

  highlights: {
    get: (location?: string) => http.get('/api/ateneu/highlights', { params: { location } }),
    getSidebar: (limit = 2) => http.get('/api/ateneu/highlights/sidebar', { params: { limit } }),
  },

  search: {
    getSuggestions: (q: string) => http.get('/api/ateneu/search/suggestions', { params: { q } }),
  },

  calendar: {
    getAvailability: (month: number, year: number) =>
      http.get('/api/ateneu/calendar/events-availability', { params: { month, year } }),
  },

  favorites: {
    add: (eventId: string) => http.post(`/api/ateneu/users/favorites/${eventId}`),
    remove: (eventId: string) => http.delete(`/api/ateneu/users/favorites/${eventId}`),
  },

  reviews: {
    getSummary: (eventId: string) => http.get(`/api/ateneu/events/${eventId}/reviews/summary`),
    post: (eventId: string, p: ReviewPayload) => http.post(`/api/ateneu/events/${eventId}/reviews`, p),
  },
}
