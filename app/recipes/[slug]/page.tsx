import {
  loadMarkdownRecipeBySlug,
  getAllMarkdownRecipeSlugs,
} from "@/utils/loadMarkdownRecipe";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import RecipePageClient from "@/components/recipe-display/RecipePageClient";

export async function generateStaticParams() {
  const slugs = await getAllMarkdownRecipeSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata for each recipe page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const recipe = await loadMarkdownRecipeBySlug(slug);
  if (recipe) {
    return {
      title: `${recipe.title} | Cafe TM`,
      description: recipe.subtitle || "Explore our ever-evolving family recipes",
    };
  }

  return { title: "Recipe Not Found | Cafe TM" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const recipe = await loadMarkdownRecipeBySlug(slug);
  if (!recipe) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <RecipePageClient recipe={recipe} />
    </div>
  );
}
