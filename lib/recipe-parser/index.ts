import fs from "fs/promises";
import path from "path";
import { remark } from "remark";
import type { Root } from "mdast";
import type { Recipe, RecipeCard } from "@/lib/recipe-types";
import { parseFrontmatter } from "./frontmatter-parser";
import { parseIngredients } from "./ingredient-parser";
import { parseInstructions } from "./instruction-parser";
import matter from "gray-matter";

const recipesDir = path.join(process.cwd(), "data/recipes");

/**
 * Get all recipe slugs (filenames without .md extension)
 */
export async function getAllRecipeSlugs(): Promise<string[]> {
  const files = await fs.readdir(recipesDir);
  return files
    .filter((name) => name.endsWith(".md") && name !== "template.md")
    .map((name) => name.replace(/\.md$/, ""));
}

/**
 * Load and parse a recipe by slug
 */
export async function parseRecipe(slug: string): Promise<Recipe | null> {
  try {
    const filePath = path.join(recipesDir, `${slug}.md`);
    const fileContents = await fs.readFile(filePath, "utf8");

    // Parse frontmatter
    const { frontmatter, content } = parseFrontmatter(fileContents);

    // Parse markdown content to AST
    const ast = remark().parse(content) as Root;

    // Extract ingredients and instructions from AST
    const ingredients = parseIngredients(ast);
    const instructions = parseInstructions(ast);

    return {
      id: frontmatter.id || slug,
      title: frontmatter.title,
      subtitle: frontmatter.subtitle,
      tags: frontmatter.tags,
      image: frontmatter.image,
      first_made: frontmatter.first_made,
      last_made: frontmatter.last_made,
      story: frontmatter.story,
      source: frontmatter.source,
      time: frontmatter.time,
      yields: frontmatter.yields,
      contributor: frontmatter.contributor,
      ingredients,
      instructions,
    };
  } catch (error) {
    // Return null if file not found (expected for non-existent recipes)
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    // Log other errors
    console.error(`Failed to parse recipe: ${slug}`, error);
    return null;
  }
}

/**
 * Load all recipes with minimal metadata (for listing pages)
 */
export async function loadAllRecipes(): Promise<RecipeCard[]> {
  try {
    const files = (await fs.readdir(recipesDir)).filter(
      (f) => f.endsWith(".md") && f !== "template.md"
    );

    return Promise.all(
      files.map(async (file) => {
        const text = await fs.readFile(path.join(recipesDir, file), "utf8");
        const { data: frontmatter } = matter(text);
        const slug = file.replace(/\.md$/, "");

        return {
          id: frontmatter.id || slug,
          title: frontmatter.title,
          subtitle: frontmatter.subtitle,
          image: frontmatter.image,
          tags: frontmatter.tags,
          first_made: frontmatter.first_made,
          last_made: frontmatter.last_made,
          contributor: frontmatter.contributor,
        };
      })
    );
  } catch (error) {
    console.warn("Could not load recipes:", error);
    return [];
  }
}

// Export legacy names for compatibility (will be updated in app pages)
export const getAllMarkdownRecipeSlugs = getAllRecipeSlugs;
export const loadMarkdownRecipeBySlug = parseRecipe;
