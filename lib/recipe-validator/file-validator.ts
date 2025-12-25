import fs from "fs/promises";
import path from "path";
import type { Recipe } from "@/lib/recipe-types";
import type { ValidationIssue } from "./types";

/**
 * Validate file-related aspects (filename conventions, image existence)
 */
export async function validateFile(
  slug: string,
  recipe: Recipe
): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];

  // Check for underscores in filename
  if (slug.includes("_")) {
    issues.push({
      slug,
      severity: "error",
      category: "file",
      field: "filename",
      message:
        "Filename must use hyphens, not underscores (e.g., my-recipe.md not my_recipe.md)",
    });
  }

  // Image file existence check
  if (recipe.image) {
    const imagePath = path.join(
      process.cwd(),
      "public",
      "images",
      recipe.image
    );
    try {
      await fs.access(imagePath);
    } catch {
      issues.push({
        slug,
        severity: "warning",
        category: "file",
        field: "image",
        message: `Image file not found: ${recipe.image}`,
      });
    }
  }

  return issues;
}
