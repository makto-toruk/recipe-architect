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
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Initialize from URL params
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    const searchParam = searchParams.get("search");
    const contributorParam = searchParams.get("contributor");

    if (tagParam) {
      setSelectedTag(tagParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (contributorParam) {
      setSelectedContributor(contributorParam);
    }
  }, [searchParams]);

  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedTag) {
      params.set("tag", selectedTag);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (selectedContributor) {
      params.set("contributor", selectedContributor);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/recipes?${queryString}` : "/recipes";
    window.history.replaceState({}, "", newUrl);
  }, [searchQuery, selectedTag, selectedContributor]);

  const filteredRecipes = filterRecipes(recipes, searchQuery, selectedTag, selectedContributor);

  const handleTagRemove = () => {
    setSelectedTag(null);
  };

  const handleContributorRemove = () => {
    setSelectedContributor(null);
  };

  return (
    <>
      {/* Search Input Section */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search by recipe name or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none"
            style={{
              backgroundColor: "var(--color-cream)",
              borderColor: isFocused || searchQuery
                ? "var(--color-burnt-orange)"
                : "var(--color-border-subtle)",
              color: "var(--color-text-primary)",
              paddingRight: searchQuery ? "2.5rem" : "1rem",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg transition-opacity hover:opacity-60"
              style={{
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
        {selectedContributor && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-2xl mx-auto">
            <button
              onClick={handleContributorRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-sm rounded-full transition-opacity hover:opacity-80"
              style={{
                backgroundColor: "var(--color-burnt-orange)",
                color: "white",
              }}
              aria-label={`Remove ${selectedContributor} contributor filter`}
            >
              {selectedContributor}
              <span className="text-xs">✕</span>
            </button>
          </div>
        )}
        {(searchQuery || selectedTag || selectedContributor) && (
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
