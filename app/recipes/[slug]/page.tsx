import { loadRecipeBySlug, getAllRecipeSlugs } from "@/utils/loadRecipe";
import RecipeHeader from "@/components/RecipeHeader";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeInstructions from "@/components/RecipeInstructions";
import { notFound } from "next/navigation";
import type { LoadedRecipe } from "@/types";

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Page(props: { params: { slug: string } }) {
  const { params } = await props;
  const { slug } = await params;
  const data = await loadRecipeBySlug(slug);
  if (!data) return notFound();

  const { recipe, ingredients, units } = data as LoadedRecipe;

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
          />
          <RecipeInstructions recipe={recipe} />
        </div>

        {/* Desktop: Side-by-side Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Ingredients */}
          <div>
            <RecipeIngredients
              recipe={recipe}
              ingredients={ingredients}
              units={units}
            />
          </div>

          {/* Right Column - Instructions */}
          <div>
            <RecipeInstructions recipe={recipe} />
          </div>
        </div>
      </div>
    </main>
  );
}
