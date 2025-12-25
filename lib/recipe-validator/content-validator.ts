import type { Recipe } from "@/lib/recipe-types";
import type { ValidationIssue } from "./types";

/**
 * Validate recipe content quality (ingredients, instructions)
 */
export function validateContent(slug: string, recipe: Recipe): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Content validation
  if (recipe.ingredients.length === 0) {
    issues.push({
      slug,
      severity: "warning",
      category: "content",
      field: "ingredients",
      message: "No ingredients found - check markdown formatting",
    });
  }

  if (recipe.instructions.length === 0) {
    issues.push({
      slug,
      severity: "warning",
      category: "content",
      field: "instructions",
      message: "No instructions found - check markdown formatting",
    });
  }

  // Ingredient quality checks
  for (const ing of recipe.ingredients) {
    if (!ing.name || ing.name.length < 2) {
      issues.push({
        slug,
        severity: "warning",
        category: "content",
        field: "ingredients",
        message: `Ingredient has suspiciously short name: "${ing.name}"`,
      });
    }

    if (!ing.quantity && !ing.unit) {
      issues.push({
        slug,
        severity: "info",
        category: "content",
        field: "ingredients",
        message: `Ingredient without quantity or unit: "${ing.name}"`,
      });
    }
  }

  // Instruction quality checks
  const stepNumbers = recipe.instructions.map((i) => i.step);
  const uniqueSteps = new Set(stepNumbers);
  if (uniqueSteps.size !== stepNumbers.length) {
    issues.push({
      slug,
      severity: "error",
      category: "content",
      field: "instructions",
      message: "Duplicate instruction step numbers found",
    });
  }

  for (let i = 1; i < stepNumbers.length; i++) {
    if (stepNumbers[i] !== stepNumbers[i - 1] + 1) {
      issues.push({
        slug,
        severity: "warning",
        category: "content",
        field: "instructions",
        message: `Non-sequential step numbers: ${stepNumbers[i - 1]} → ${stepNumbers[i]}`,
      });
    }
  }

  return issues;
}
