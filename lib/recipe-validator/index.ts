import { getAllRecipeSlugs, parseRecipe } from "@/lib/recipe-parser";
import { validateSchema } from "./schema-validator";
import { validateContent } from "./content-validator";
import { validateFile } from "./file-validator";
import type { ValidationResult, ValidationIssue } from "./types";

/**
 * Validate a single recipe by slug
 */
export async function validateRecipe(slug: string): Promise<ValidationResult> {
  const issues: ValidationIssue[] = [];

  const recipe = await parseRecipe(slug);

  if (!recipe) {
    issues.push({
      slug,
      severity: "error",
      category: "file",
      field: "file",
      message: "Failed to parse markdown file",
    });
    return { slug, issues };
  }

  // Run all validators
  const schemaIssues = validateSchema(slug, recipe);
  const contentIssues = validateContent(slug, recipe);
  const fileIssues = await validateFile(slug, recipe);

  issues.push(...schemaIssues, ...contentIssues, ...fileIssues);

  return { slug, issues };
}

/**
 * Validate all recipes
 */
export async function validateAllRecipes(): Promise<ValidationResult[]> {
  const slugs = await getAllRecipeSlugs();
  const results: ValidationResult[] = [];

  for (const slug of slugs) {
    const result = await validateRecipe(slug);
    results.push(result);
  }

  return results;
}
