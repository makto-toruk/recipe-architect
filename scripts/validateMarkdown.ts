import fs from "fs/promises";
import path from "path";
import {
  loadMarkdownRecipeBySlug,
  getAllMarkdownRecipeSlugs,
} from "../utils/loadMarkdownRecipe.js";

interface ValidationIssue {
  slug: string;
  severity: "error" | "warning" | "info";
  field: string;
  message: string;
}

async function validateMarkdownRecipes(): Promise<void> {
  const issues: ValidationIssue[] = [];
  const slugs = await getAllMarkdownRecipeSlugs();

  console.log(`\n📋 Validating ${slugs.length} markdown recipes...\n`);

  for (const slug of slugs) {
    // Check for underscores in filename
    if (slug.includes("_")) {
      issues.push({
        slug,
        severity: "error",
        field: "filename",
        message: "Filename must use hyphens, not underscores (e.g., my-recipe.md not my_recipe.md)",
      });
    }

    const recipe = await loadMarkdownRecipeBySlug(slug);

    if (!recipe) {
      issues.push({
        slug,
        severity: "error",
        field: "file",
        message: "Failed to parse markdown file",
      });
      continue;
    }

    // Required fields
    if (!recipe.title) {
      issues.push({
        slug,
        severity: "error",
        field: "title",
        message: "Missing required field: title",
      });
    }

    // Recommended fields
    if (!recipe.subtitle) {
      issues.push({
        slug,
        severity: "info",
        field: "subtitle",
        message: "Missing recommended field: subtitle",
      });
    }

    if (!recipe.image) {
      issues.push({
        slug,
        severity: "info",
        field: "image",
        message: "Missing recommended field: image",
      });
    }

    if (!recipe.tags || recipe.tags.length === 0) {
      issues.push({
        slug,
        severity: "info",
        field: "tags",
        message: "Missing recommended field: tags",
      });
    }

    // Content validation
    if (recipe.ingredients.length === 0) {
      issues.push({
        slug,
        severity: "warning",
        field: "ingredients",
        message: "No ingredients found - check markdown formatting",
      });
    }

    if (recipe.instructions.length === 0) {
      issues.push({
        slug,
        severity: "warning",
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
          field: "ingredients",
          message: `Ingredient has suspiciously short name: "${ing.name}"`,
        });
      }

      if (!ing.quantity && !ing.unit) {
        issues.push({
          slug,
          severity: "info",
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
        field: "instructions",
        message: "Duplicate instruction step numbers found",
      });
    }

    for (let i = 1; i < stepNumbers.length; i++) {
      if (stepNumbers[i] !== stepNumbers[i - 1] + 1) {
        issues.push({
          slug,
          severity: "warning",
          field: "instructions",
          message: `Non-sequential step numbers: ${stepNumbers[i - 1]} → ${stepNumbers[i]}`,
        });
      }
    }

    // Date format validation
    if (recipe.first_made && !isValidDate(recipe.first_made)) {
      issues.push({
        slug,
        severity: "warning",
        field: "first_made",
        message: `Invalid date format: "${recipe.first_made}" (expected YYYY-MM-DD)`,
      });
    }

    if (recipe.last_made && !isValidDate(recipe.last_made)) {
      issues.push({
        slug,
        severity: "warning",
        field: "last_made",
        message: `Invalid date format: "${recipe.last_made}" (expected YYYY-MM-DD)`,
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
          field: "image",
          message: `Image file not found: ${recipe.image}`,
        });
      }
    }
  }

  // Report results
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  if (issues.length === 0) {
    console.log("✅ All markdown recipes validated successfully!\n");
    return;
  }

  console.log("📊 Validation Results\n");

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} errors:\n`);
    for (const issue of errors) {
      console.log(`  ${issue.slug} [${issue.field}]: ${issue.message}`);
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} warnings:\n`);
    for (const issue of warnings) {
      console.log(`  ${issue.slug} [${issue.field}]: ${issue.message}`);
    }
    console.log("");
  }

  if (infos.length > 0) {
    console.log(`ℹ️  ${infos.length} info:\n`);
    for (const issue of infos) {
      console.log(`  ${issue.slug} [${issue.field}]: ${issue.message}`);
    }
    console.log("");
  }

  // Don't exit with error - just inform
  console.log("✨ Validation complete (informational only)\n");
}

function isValidDate(dateStr: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(dateStr)) return false;

  const date = new Date(dateStr);
  return date.toISOString().startsWith(dateStr);
}

// Run validation
validateMarkdownRecipes().catch(console.error);
