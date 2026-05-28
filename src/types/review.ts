export interface Review {
  id: string
  eventId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
  author?: { firstName: string; lastName: string }
}

export interface ReviewSummary {
  avgRating: number
  totalReviews: number
  distribution: Record<number, number>
  recentReviews: Review[]
}

export interface ReviewPayload {
  rating: number
  comment?: string
}
