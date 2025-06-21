"use client";

import { useState } from "react";
import RecipeHeader from "@/components/RecipeHeader";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeInstructions from "@/components/RecipeInstructions";
import Header from "@/components/Header";
import type { LoadedRecipe } from "@/types";

interface RecipePageClientProps {
  data: LoadedRecipe;
}

export default function RecipePageClient({ data }: RecipePageClientProps) {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [checkedInstructions, setCheckedInstructions] = useState<Set<string>>(
    new Set()
  );

  const { recipe, ingredients, units, subrecipes = [] } = data;

  const handleFocusModeToggle = (enabled: boolean) => {
    setFocusModeEnabled(enabled);
  };

  const handleIngredientCheck = (key: string, checked: boolean) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(key);
      } else {
        newSet.delete(key);
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
      return newSet;
    });
  };

  return (
    <>
      <Header
        onFocusModeToggle={handleFocusModeToggle}
        focusModeEnabled={focusModeEnabled}
      />
      <main className="min-h-screen bg-white flex-grow">
        <div className="max-w-5xl mx-auto p-6">
          {/* Recipe Header - conditionally hide elements in focus mode */}
          <RecipeHeader recipe={recipe} focusModeEnabled={focusModeEnabled} />

          {/* Mobile: Stacked Layout */}
          <div className="lg:hidden">
            <RecipeIngredients
              recipe={recipe}
              ingredients={ingredients}
              units={units}
              subrecipes={subrecipes}
              focusModeEnabled={focusModeEnabled}
              checkedIngredients={checkedIngredients}
              onIngredientCheck={handleIngredientCheck}
            />
            <RecipeInstructions
              recipe={recipe}
              subrecipes={subrecipes}
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
                recipe={recipe}
                ingredients={ingredients}
                units={units}
                subrecipes={subrecipes}
                focusModeEnabled={focusModeEnabled}
                checkedIngredients={checkedIngredients}
                onIngredientCheck={handleIngredientCheck}
              />
            </div>

            {/* Right Column - Instructions (2/3) */}
            <div className="lg:col-span-2">
              <RecipeInstructions
                recipe={recipe}
                subrecipes={subrecipes}
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
