import SiteHeader from "@/components/SiteHeader";
import { loadAllRecipes } from "@/lib/recipe-parser";
import RecipeCard from "@/components/RecipeCard";
import { loadMarkdown } from "@/lib/loadMarkdown";

export const metadata = {
  title: "Cafe TM | Kitchen Lab",
  description: "Explore our ever-evolving family recipes",
};

export default async function Home() {
  const allRecipes = await loadAllRecipes();
  const aboutHtml = await loadMarkdown("about.md");

  // Sort recipes by most recent date (coalesce last_made and first_made)
  const sortedRecipes = allRecipes
    .map((recipe) => ({
      ...recipe,
      mostRecentDate: recipe.last_made || recipe.first_made,
    }))
    .filter((recipe) => recipe.mostRecentDate && recipe.image) // Only include recipes with dates and images
    .sort((a, b) => {
      // Sort by most recent date descending
      return (
        new Date(b.mostRecentDate!).getTime() -
        new Date(a.mostRecentDate!).getTime()
      );
    })
    .slice(0, 3); // Take the 3 most recent

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream-lightest)' }}>
      <SiteHeader />
      <main className="min-h-screen py-12" style={{ backgroundColor: 'var(--color-cream-lightest)' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Recent Recipes Section */}
          {sortedRecipes.length > 0 && (
            <section className="mb-12">
              <h2
                className="text-2xl font-light mb-8"
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  color: 'var(--color-text-primary)'
                }}
              >
                Recent recipes
              </h2>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {sortedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            </section>
          )}

          {/* Browse More Section */}
          <div className="text-center mb-16">
            <a
              href="/recipes"
              className="browse-recipes-btn inline-block px-6 py-3 text-white rounded transition-colors"
            >
              Browse All Recipes
            </a>
          </div>

          {/* About Section */}
          <section className="border-t pt-12" style={{ borderColor: 'var(--color-border-subtle)' }}>
            <div className="max-w-3xl mx-auto">
              <article className="prose prose-lg prose-gray">
                <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
              </article>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
