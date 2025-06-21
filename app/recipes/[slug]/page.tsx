import { loadRecipeBySlug, getAllRecipeSlugs } from "@/utils/loadRecipe";
import { notFound } from "next/navigation";
import type { LoadedRecipe, Recipe } from "@/types";
import { Metadata } from "next";
import RecipePageClient from "@/components/RecipePageClient";

export async function generateStaticParams() {
  const slugs = await getAllRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata for each recipe page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = (await loadRecipeBySlug(slug)) as LoadedRecipe | null;
  if (!data) return { title: "Recipe Not Found | Cafe TM" };
  return {
    title: `${data.recipe.title} | Cafe TM`,
    // TODO: update this with description when we add them
    description: "Explore our ever-evolving family recipes",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = (await loadRecipeBySlug(slug)) as LoadedRecipe | null;
  if (!data) return notFound();

  // Return a full page layout since this recipe page needs to control its own header
  return (
    <div className="min-h-screen flex flex-col">
      <RecipePageClient data={data} />
    </div>
  );
}
