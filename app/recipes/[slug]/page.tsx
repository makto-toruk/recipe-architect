import { loadRecipeBySlug, getAllRecipeSlugs } from "@/utils/loadRecipe";
import RecipeHeader from "@/components/RecipeHeader";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeInstructions from "@/components/RecipeInstructions";
import { notFound } from "next/navigation";
import type { LoadedRecipe, Recipe } from "@/types";

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = (await loadRecipeBySlug(slug)) as LoadedRecipe | null;
  if (!data) return notFound();

  const { recipe, ingredients, units, subrecipes = [] } = data;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto p-6">
        {/* Recipe Header - Full Width */}
        <RecipeHeader recipe={recipe} />

        {/* Mobile: Stacked Layout */}
        <div className="lg:hidden">
          <RecipeIngredients
            recipe={recipe}
            ingredients={ingredients}
            units={units}
            subrecipes={subrecipes}
          />
          <RecipeInstructions recipe={recipe} subrecipes={subrecipes} />
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
            />
          </div>

          {/* Right Column - Instructions (2/3) */}
          <div className="lg:col-span-2">
            <RecipeInstructions recipe={recipe} subrecipes={subrecipes} />
          </div>
        </div>
      </div>
    </main>
  );
}
