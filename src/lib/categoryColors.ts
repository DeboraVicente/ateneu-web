const CATEGORY_COLOR: Record<string, string> = {
  MUSEU:       '#274B9B',
  TEATRO:      '#274B9B',
  EXPOSICAO:   '#274B9B',
  SHOWS:       '#946E7F',
  CINEMA:      '#A81919',
  GASTRONOMIA: '#A81919',
  PARQUE:      '#5F935D',
  AR_LIVRE:    '#5F935D',
  IGREJA:      '#95C11F',
  FEIRA:       '#95C11F',
};

export function categoryColor(category: string): string {
  return CATEGORY_COLOR[category] ?? '#274B9B';
}
