import fs from "fs/promises";
import path from "path";

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

export type LoadedRecipe = {
  recipe: any;
  ingredients: Record<string, any>;
  units: Record<string, any>;
};

export async function loadRecipeBySlug(
  slug: string
): Promise<LoadedRecipe | null> {
  try {
    const [recipeText, ingredientsText, unitsText] = await Promise.all([
      fs.readFile(path.join(recipeDir, `${slug}.json`), "utf8"),
      fs.readFile(ingredientFile, "utf8"),
      fs.readFile(unitFile, "utf8"),
    ]);

    return {
      recipe: JSON.parse(recipeText),
      ingredients: JSON.parse(ingredientsText),
      units: JSON.parse(unitsText),
    };
  } catch {
    return null;
  }
}
