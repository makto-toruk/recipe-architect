import fs from "fs/promises";
import path from "path";
import type { Recipe, Ingredients, Units, LoadedRecipe } from "../types";

const baseDir = path.join(process.cwd(), "data");
const recipeDir = path.join(baseDir, "recipes");
const ingredientFile = path.join(baseDir, "ingredients.json");
const unitFile = path.join(baseDir, "units.json");

export async function getAllRecipeSlugs(): Promise<string[]> {
  const files = await fs.readdir(recipeDir);
  return files
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""));
}

export async function loadRecipeBySlug(
  slug: string
): Promise<LoadedRecipe | null> {
  try {
    const [recipeText, ingredientsText, unitsText] = await Promise.all([
      fs.readFile(path.join(recipeDir, `${slug}.json`), "utf8"),
      fs.readFile(ingredientFile, "utf8"),
      fs.readFile(unitFile, "utf8"),
    ]);

    const recipe = JSON.parse(recipeText) as Recipe;
    const ingredients = JSON.parse(ingredientsText) as Ingredients;
    const units = JSON.parse(unitsText) as Units;

    // load any subrecipes declared in the JSON
    let subrecipes: Recipe[] = [];
    if (recipe.subrecipes && recipe.subrecipes.length > 0) {
      subrecipes = await Promise.all(
        recipe.subrecipes.map(async ({ ref }) => {
          const text = await fs.readFile(
            path.join(recipeDir, `${ref}.json`),
            "utf8"
          );
          return JSON.parse(text) as Recipe;
        })
      );
    }

    return { recipe, ingredients, units, subrecipes };
  } catch {
    return null;
  }
}
