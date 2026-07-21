import {
  Sparkles, Clapperboard, Drama, Music, UtensilsCrossed,
  Landmark, Trees, Church, ShoppingBag, Image, Palette, MapPin,
  type LucideIcon,
} from 'lucide-vue-next';

export const CATEGORY_ICON: Record<string, LucideIcon> = {
  '':            Sparkles,
  CINEMA:        Clapperboard,
  TEATRO:        Drama,
  SHOWS:         Music,
  GASTRONOMIA:   UtensilsCrossed,
  MUSEU:         Landmark,
  PARQUE:        Trees,
  IGREJA:        Church,
  FEIRA:         ShoppingBag,
  EXPOSICAO:     Image,
  AR_LIVRE:      Palette,
  OUTRO:         MapPin,
};

export function categoryIcon(category: string): LucideIcon {
  return CATEGORY_ICON[category] ?? MapPin;
}
