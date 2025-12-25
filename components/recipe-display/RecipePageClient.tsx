"use client";

import { useState, useEffect } from "react";
import RecipeMetadata from "./RecipeMetadata";
import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import SiteHeader from "@/components/SiteHeader";
import type { Recipe } from "@/lib/recipe-types";

interface MarkdownRecipePageClientProps {
  recipe: Recipe;
}

export default function MarkdownRecipePageClient({
  recipe,
}: MarkdownRecipePageClientProps) {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [checkedInstructions, setCheckedInstructions] = useState<Set<string>>(
    new Set()
  );

  // Generate unique storage keys for this recipe
  const storageKeyPrefix = `recipe-${recipe.id}`;
  const focusModeKey = `${storageKeyPrefix}-focus`;
  const ingredientsKey = `${storageKeyPrefix}-ingredients`;
  const instructionsKey = `${storageKeyPrefix}-instructions`;

  // Load persisted state on mount
  useEffect(() => {
    try {
      // Load focus mode
      const savedFocusMode = localStorage.getItem(focusModeKey);
      if (savedFocusMode !== null) {
        setFocusModeEnabled(JSON.parse(savedFocusMode));
      }

      // Load checked ingredients
      const savedIngredients = localStorage.getItem(ingredientsKey);
      if (savedIngredients) {
        const ingredientsList = JSON.parse(savedIngredients);
        setCheckedIngredients(new Set(ingredientsList));
      }

      // Load checked instructions
      const savedInstructions = localStorage.getItem(instructionsKey);
      if (savedInstructions) {
        const instructionsList = JSON.parse(savedInstructions);
        setCheckedInstructions(new Set(instructionsList));
      }
    } catch (error) {
      console.warn("Failed to load recipe state from localStorage:", error);
    }
  }, [focusModeKey, ingredientsKey, instructionsKey]);

  const handleFocusModeToggle = (enabled: boolean) => {
    setFocusModeEnabled(enabled);
    try {
      localStorage.setItem(focusModeKey, JSON.stringify(enabled));
    } catch (error) {
      console.warn("Failed to save focus mode to localStorage:", error);
    }
  };

  const handleIngredientCheck = (key: string, checked: boolean) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(key);
      } else {
        newSet.delete(key);
      }

      // Persist to localStorage
      try {
        localStorage.setItem(
          ingredientsKey,
          JSON.stringify(Array.from(newSet))
        );
      } catch (error) {
        console.warn("Failed to save ingredients to localStorage:", error);
      }

      return newSet;
    });
  };

  const handleInstructionCheck = (key: string, checked: boolean) => {
    setCheckedInstructions((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(key);
      } else {
        newSet.delete(key);
      }

      // Persist to localStorage
      try {
        localStorage.setItem(
          instructionsKey,
          JSON.stringify(Array.from(newSet))
        );
      } catch (error) {
        console.warn("Failed to save instructions to localStorage:", error);
      }

      return newSet;
    });
  };

  const handleClearProgress = () => {
    setCheckedIngredients(new Set());
    setCheckedInstructions(new Set());
    try {
      localStorage.removeItem(ingredientsKey);
      localStorage.removeItem(instructionsKey);
    } catch (error) {
      console.warn("Failed to clear progress from localStorage:", error);
    }
  };

  return (
    <>
      <SiteHeader
        onFocusModeToggle={handleFocusModeToggle}
        focusModeEnabled={focusModeEnabled}
      />
      <main className="min-h-screen bg-white flex-grow">
        <div className="max-w-5xl mx-auto p-6">
          {/* Recipe Header - conditionally hide elements in focus mode */}
          <RecipeMetadata recipe={recipe} focusModeEnabled={focusModeEnabled} />

          {/* Clear Progress Button in focus mode */}
          {focusModeEnabled &&
            (checkedIngredients.size > 0 || checkedInstructions.size > 0) && (
              <div className="mb-6 flex justify-center">
                <button
                  onClick={handleClearProgress}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Clear Progress
                </button>
              </div>
            )}

          {/* Mobile: Stacked Layout */}
          <div className="lg:hidden">
            <RecipeIngredients
              ingredients={recipe.ingredients}
              focusModeEnabled={focusModeEnabled}
              checkedIngredients={checkedIngredients}
              onIngredientCheck={handleIngredientCheck}
            />
            <RecipeInstructions
              instructions={recipe.instructions}
              focusModeEnabled={focusModeEnabled}
              checkedInstructions={checkedInstructions}
              onInstructionCheck={handleInstructionCheck}
            />
          </div>

          {/* Desktop: Side-by-side Layout - 1/3 ingredients, 2/3 instructions */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-12 lg:items-start">
            {/* Left Column - Ingredients (1/3) */}
            <div className="lg:col-span-1">
              <RecipeIngredients
                ingredients={recipe.ingredients}
                focusModeEnabled={focusModeEnabled}
                checkedIngredients={checkedIngredients}
                onIngredientCheck={handleIngredientCheck}
              />
            </div>

            {/* Right Column - Instructions (2/3) */}
            <div className="lg:col-span-2">
              <RecipeInstructions
                instructions={recipe.instructions}
                focusModeEnabled={focusModeEnabled}
                checkedInstructions={checkedInstructions}
                onInstructionCheck={handleInstructionCheck}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
