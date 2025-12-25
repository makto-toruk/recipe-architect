import SiteHeader from "@/components/SiteHeader";
import { loadAllRecipes } from "@/lib/recipe-parser";
import RecipeCard from "@/components/RecipeCard";

export const metadata = {
  title: "Cafe TM | Kitchen Lab",
  description: "Explore our ever-evolving family recipes",
};

export default async function Home() {
  const allRecipes = await loadAllRecipes();

  // Sort recipes by most recent date (coalesce last_made and first_made)
  const sortedRecipes = allRecipes
    .map((recipe) => ({
      ...recipe,
      mostRecentDate: recipe.last_made || recipe.first_made,
    }))
    .filter((recipe) => recipe.mostRecentDate) // Only include recipes with dates
    .sort((a, b) => {
      // Sort by most recent date descending
      return (
        new Date(b.mostRecentDate!).getTime() -
        new Date(a.mostRecentDate!).getTime()
      );
    })
    .slice(0, 3); // Take the 3 most recent

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="min-h-screen bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Recent Recipes Section */}
          {sortedRecipes.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-light mb-8 text-gray-900">
                Recent Recipes
              </h2>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {sortedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </section>
          )}

          {/* Browse More Section */}
          <div className="text-center">
            <a
              href="/recipes"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
            >
              Browse All Recipes
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
