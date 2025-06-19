import { loadRecipeBySlug, getAllRecipeSlugs } from "@/utils/loadRecipe";
import RecipeHeader from "@/components/RecipeHeader";
import RecipeIngredients from "@/components/RecipeIngredients";
import RecipeInstructions from "@/components/RecipeInstructions";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function Page(props: { params: { slug: string } }) {
  const { params } = await props;
  const { slug } = await params;
  const data = await loadRecipeBySlug(slug);
  if (!data) return notFound();

  const { recipe, ingredients, units } = data;

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <RecipeHeader recipe={recipe} />
      <RecipeIngredients
        recipe={recipe}
        ingredients={ingredients}
        units={units}
      />
      <RecipeInstructions recipe={recipe} />
    </main>
  );
}
