export interface Category {
  slug: string;
  label: string;
  emoji: string;
  color: string; // hex, used for badges/filters
}

export const CATEGORIES: Category[] = [
  { slug: "landscape", label: "풍경", emoji: "🏞️", color: "#2E7D32" },
  { slug: "portrait", label: "인물", emoji: "👤", color: "#6D3BEA" },
  { slug: "daily", label: "일상", emoji: "🌿", color: "#0288D1" },
  { slug: "food", label: "음식", emoji: "🍽️", color: "#EF6C00" },
  { slug: "travel", label: "여행", emoji: "✈️", color: "#00897B" },
  { slug: "animal", label: "동물", emoji: "🐾", color: "#C2185B" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
