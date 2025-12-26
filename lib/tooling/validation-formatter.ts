import type { ValidationResult } from "@/lib/recipe-validator/types";

/**
 * Format and display validation results
 */
export function displayValidationResults(
  results: ValidationResult[],
  options: { showRecipeCount?: boolean } = {}
): void {
  const { showRecipeCount = true } = options;

  // Collect all issues by severity
  const allIssues = results.flatMap((r) => r.issues);
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");
  const infos = allIssues.filter((i) => i.severity === "info");

  const totalRecipes = results.length;

  if (allIssues.length === 0) {
    if (showRecipeCount) {
      console.log(`✅ All ${totalRecipes} recipes validated successfully!\n`);
    } else {
      console.log("✅ Recipe validated successfully!\n");
    }
    return;
  }

  console.log("📊 Validation Results\n");

  if (errors.length > 0) {
    console.log(`❌ ${errors.length} error${errors.length === 1 ? "" : "s"}:\n`);
    for (const issue of errors) {
      console.log(`  ${issue.slug} [${issue.field}]: ${issue.message}`);
    }
    console.log("");
  }

  if (warnings.length > 0) {
    console.log(
      `⚠️  ${warnings.length} warning${warnings.length === 1 ? "" : "s"}:\n`
    );
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

  console.log("✨ Validation complete (informational only)\n");
}
