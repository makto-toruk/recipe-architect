/**
 * Shared styling constants for card components (RecipeCard, ContributorCard)
 * to ensure consistent hover, focus, and visual effects across all cards.
 */

export const CARD_BASE_CLASSES =
  "block rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 focus:outline-none transition-all duration-200 border border-[color:var(--color-border-subtle)]";

export const CARD_BASE_STYLE = {
  backgroundColor: 'var(--color-cream-lightest)',
  borderColor: 'var(--color-border-subtle)'
} as const;
