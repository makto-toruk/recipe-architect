import type { RecipeCard } from "@/lib/recipe-types";

/**
 * Filters recipes based on a search query and/or selected tag.
 * Searches across recipe title and tags (case-insensitive).
 * Both filters use AND logic when present.
 *
 * @param recipes - Array of recipe cards to filter
 * @param searchQuery - Search term to match against
 * @param selectedTag - Specific tag to filter by (exact match)
 * @returns Filtered array of recipes matching the filters
 */
export function filterRecipes(
  recipes: RecipeCard[],
  searchQuery: string,
  selectedTag: string | null
): RecipeCard[] {
  return recipes.filter((recipe) => {
    // Text search filter (if query exists)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = recipe.title.toLowerCase().includes(query);
      const tagsMatch = (recipe.tags || []).some((tag) =>
        tag.toLowerCase().includes(query)
      );
      if (!titleMatch && !tagsMatch) return false;
    }

    // Tag filter (if tag is selected)
    if (selectedTag) {
      const recipeTags = recipe.tags || [];
      if (!recipeTags.includes(selectedTag)) return false;
    }

    return true;
  });
}
