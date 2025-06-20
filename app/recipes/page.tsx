import { loadAllRecipes } from "@/utils/loadAllRecipes";
import RecipeCard from "@/components/RecipeCard";

export const metadata = {
  title: "Kitchen Lab | Recipe Architect",
  description: "Explore our ever-evolving family recipes",
};

export default async function RecipesPage() {
  const recipes = await loadAllRecipes(); // server-side, static

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-light italic mb-10 text-gray-900">
          Kitchen Lab
        </h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <RecipeCard key={r.id} {...r} />
          ))}
        </div>
      </div>
    </main>
  );
}
