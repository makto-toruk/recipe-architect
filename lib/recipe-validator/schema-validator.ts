import type { Recipe } from "@/lib/recipe-types";
import type { ValidationIssue } from "./types";

/**
 * Validate recipe frontmatter schema (required/optional fields, date formats)
 */
export function validateSchema(slug: string, recipe: Recipe): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Required fields
  if (!recipe.title) {
    issues.push({
      slug,
      severity: "error",
      category: "schema",
      field: "title",
      message: "Missing required field: title",
      blocking: true,
    });
  }

  if (!recipe.id) {
    issues.push({
      slug,
      severity: "error",
      category: "schema",
      field: "id",
      message: "Missing required field: id",
      blocking: true,
    });
  }

  if (recipe.id !== slug) {
    issues.push({
      slug,
      severity: "error",
      category: "schema",
      field: "id",
      message: `ID mismatch: frontmatter id '${recipe.id}' does not match filename '${slug}'`,
      blocking: true,
    });
  }

  if (recipe.ingredients.length === 0) {
    issues.push({
      slug,
      severity: "error",
      category: "schema",
      field: "ingredients",
      message: "Missing required field: ingredients (no ingredients found)",
      blocking: true,
    });
  }

  if (recipe.instructions.length === 0) {
    issues.push({
      slug,
      severity: "error",
      category: "schema",
      field: "instructions",
      message: "Missing required field: instructions (no instructions found)",
      blocking: true,
    });
  }

  // Recommended fields
  if (!recipe.subtitle) {
    issues.push({
      slug,
      severity: "info",
      category: "schema",
      field: "subtitle",
      message: "Missing recommended field: subtitle",
    });
  }

  if (!recipe.image) {
    issues.push({
      slug,
      severity: "info",
      category: "schema",
      field: "image",
      message: "Missing recommended field: image",
    });
  }

  if (!recipe.tags || recipe.tags.length === 0) {
    issues.push({
      slug,
      severity: "info",
      category: "schema",
      field: "tags",
      message: "Missing recommended field: tags",
    });
  }

  // Date format validation
  if (recipe.first_made && !isValidDate(recipe.first_made)) {
    issues.push({
      slug,
      severity: "warning",
      category: "schema",
      field: "first_made",
      message: `Invalid date format: "${recipe.first_made}" (expected YYYY-MM-DD)`,
    });
  }

  if (recipe.last_made && !isValidDate(recipe.last_made)) {
    issues.push({
      slug,
      severity: "warning",
      category: "schema",
      field: "last_made",
      message: `Invalid date format: "${recipe.last_made}" (expected YYYY-MM-DD)`,
    });
  }

  return issues;
}

function isValidDate(dateStr: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateStr)) return false;

  const date = new Date(dateStr);
  return date.toISOString().startsWith(dateStr);
}
