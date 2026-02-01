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

  // Gallery directory existence check
  if (recipe.gallery) {
    const galleryPath = path.join(
      process.cwd(),
      "public",
      "images",
      recipe.gallery
    );
    try {
      const stats = await fs.stat(galleryPath);
      if (!stats.isDirectory()) {
        issues.push({
          slug,
          severity: "warning",
          category: "file",
          field: "gallery",
          message: `Gallery path is not a directory: ${recipe.gallery}`,
        });
      }
    } catch {
      issues.push({
        slug,
        severity: "warning",
        category: "file",
        field: "gallery",
        message: `Gallery directory not found: ${recipe.gallery}`,
      });
    }
  }

  return issues;
}
