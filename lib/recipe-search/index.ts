import type { RecipeCard } from "@/lib/recipe-types";

/**
 * Filters recipes based on a search query.
 * Searches across recipe title and tags (case-insensitive).
 *
 * @param recipes - Array of recipe cards to filter
 * @param searchQuery - Search term to match against
 * @returns Filtered array of recipes matching the search query
 */
export function filterRecipes(
  recipes: RecipeCard[],
  searchQuery: string
): RecipeCard[] {
  const query = searchQuery.toLowerCase().trim();

  // Return all recipes if query is empty
  if (!query) {
    return recipes;
  }

  return recipes.filter((recipe) => {
    // Check if title matches
    const titleMatch = recipe.title.toLowerCase().includes(query);

    // Check if any tag matches
    const tagsMatch = (recipe.tags || []).some((tag) =>
      tag.toLowerCase().includes(query)
    );

    return titleMatch || tagsMatch;
  });
}
