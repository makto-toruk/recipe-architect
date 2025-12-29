import { loadAllRecipes } from "@/lib/recipe-parser";
import RecipesSearchClient from "@/components/RecipesSearchClient";
import SiteHeader from "@/components/SiteHeader";

export const metadata = {
  title: "Cafe TM | Kitchen Lab",
  description: "Explore our ever-evolving family recipes",
};

export default async function RecipesPage() {
  const recipes = await loadAllRecipes(); // server-side, static

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream-lightest)' }}>
      <SiteHeader />
      <main className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-cream-lightest)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <RecipesSearchClient recipes={recipes} />
        </div>
      </main>
    </div>
  );
}
