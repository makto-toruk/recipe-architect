import fs from "fs/promises";
import path from "path";
import type { Recipe } from "@/types";

const recipesDir = path.join(process.cwd(), "data/recipes");

/** Fetch id, title, image, tags for every recipe JSON file. */
export async function loadAllRecipes(): Promise<
  Pick<Recipe, "id" | "title" | "image" | "tags">[]
> {
  const files = (await fs.readdir(recipesDir)).filter((f) =>
    f.endsWith(".json")
  );

  return Promise.all(
    files.map(async (file) => {
      const text = await fs.readFile(path.join(recipesDir, file), "utf8");
      const { id, title, image, tags } = JSON.parse(text) as Recipe;
      return { id, title, image, tags };
    })
  );
}
