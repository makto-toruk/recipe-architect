"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { filterRecipes } from "@/lib/recipe-search";
import RecipeCard from "@/components/RecipeCard";
import type { RecipeCard as RecipeCardType } from "@/lib/recipe-types";

interface RecipesSearchClientProps {
  recipes: RecipeCardType[];
}

export default function RecipesSearchClient({
  recipes,
}: RecipesSearchClientProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initialize from URL param
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [searchParams]);

  const filteredRecipes = filterRecipes(recipes, searchQuery, selectedTag);

  const handleTagRemove = () => {
    setSelectedTag(null);
    window.history.replaceState({}, "", "/recipes");
  };

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
        {selectedTag && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-2xl mx-auto">
            <button
              onClick={handleTagRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--color-sage-green)",
                color: "white",
              }}
              aria-label={`Remove ${selectedTag} filter`}
            >
              {selectedTag}
              <span className="text-xs">✕</span>
            </button>
          </div>
        )}
        {(searchQuery || selectedTag) && (
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
