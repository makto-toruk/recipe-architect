import { loadAllRecipes } from "@/lib/recipe-parser";
import RecipeCard from "@/components/RecipeCard";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Cafe TM | Kitchen Lab",
  description: "Explore our ever-evolving family recipes",
};

export default async function RecipesPage() {
  const recipes = await loadAllRecipes(); // server-side, static

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="min-h-screen bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} {...r} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
