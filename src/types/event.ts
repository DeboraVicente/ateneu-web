export type EventCategory = 'all' | 'cinema' | 'theater' | 'shows' | 'gastronomy' | 'museums' | 'outdoor'
export type SortOption = 'relevance' | 'rating' | 'upcoming'

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  all: 'Tudo',
  cinema: 'Cinema',
  theater: 'Teatro',
  shows: 'Shows',
  gastronomy: 'Gastronomia',
  museums: 'Museus',
  outdoor: 'Ar Livre',
}

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: 'Mais Relevantes',
  rating: 'Melhor Avaliados',
  upcoming: 'Próximos Dias',
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
}

export interface EventMedia {
  id: string
  url: string
  altText: string
  position: number
}

export interface EventSummary {
  id: string
  title: string
  shortDescription: string
  category: EventCategory
  coverImage: string
  startDate: string
  startTime: string
  endTime: string
  ticketPrice: number
  isFree: boolean
  avgRating: number
  reviewCount: number
  isFavorite: boolean
  venue: Venue
  media: EventMedia[]
}

export interface EventDetail extends EventSummary {
  description: string
  capacity: number
  isHighlight: boolean
  highlightTag: string
  endDate: string | null
}

export interface HighlightEvent {
  id: string
  title: string
  shortDescription: string
  coverImage: string
  startDate: string
  highlightTag: string
  venue: Pick<Venue, 'name'>
}

export interface EventsParams {
  category?: EventCategory
  date?: string
  page?: number
}

export interface RecommendedParams {
  limit?: number
  sort?: SortOption
}
