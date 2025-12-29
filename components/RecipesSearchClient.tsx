"use client";

import { useState } from "react";
import { filterRecipes } from "@/lib/recipe-search";
import RecipeCard from "@/components/RecipeCard";
import type { RecipeCard as RecipeCardType } from "@/lib/recipe-types";

interface RecipesSearchClientProps {
  recipes: RecipeCardType[];
}

export default function RecipesSearchClient({
  recipes,
}: RecipesSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const filteredRecipes = filterRecipes(recipes, searchQuery);

  return (
    <>
      {/* Search Input Section */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by recipe name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{
              backgroundColor: "var(--color-cream)",
              borderColor: searchQuery
                ? "var(--color-burnt-orange)"
                : "var(--color-border-subtle)",
              color: "var(--color-text-primary)",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 py-2 rounded-md transition-colors hover:opacity-80"
              style={{
                backgroundColor: "var(--color-cream-light)",
                color: "var(--color-text-secondary)",
              }}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p
            className="text-sm mt-2 text-center max-w-2xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </p>
        )}
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((r) => (
            <RecipeCard key={r.id} {...r} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <p className="text-lg font-medium mb-2">
            No recipes found for &quot;{searchQuery}&quot;
          </p>
          <p className="text-sm">
            Try different keywords or browse all recipes
          </p>
        </div>
      )}
    </>
  );
}
