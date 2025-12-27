import type { ValidationResult } from "@/lib/recipe-validator/types";

/**
 * Check if any validation results contain blocking issues
 */
export function hasBlockingIssues(results: ValidationResult[]): boolean {
  return results.some((r) => r.issues.some((i) => i.blocking));
}

/**
 * Format and display validation results
 */
export function displayValidationResults(
  results: ValidationResult[],
  options: { showRecipeCount?: boolean; hasBlockingIssues?: boolean } = {}
): void {
  const { showRecipeCount = true, hasBlockingIssues: hasBlocking = false } = options;

  // Collect all issues by severity
  const allIssues = results.flatMap((r) => r.issues);
  const blockingErrors = allIssues.filter((i) => i.severity === "error" && i.blocking);
  const nonBlockingErrors = allIssues.filter((i) => i.severity === "error" && !i.blocking);
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

  if (blockingErrors.length > 0) {
    console.log(`🚫 ${blockingErrors.length} BLOCKING error${blockingErrors.length === 1 ? "" : "s"}:\n`);
    for (const issue of blockingErrors) {
      console.log(`  ${issue.slug} [${issue.field}]: ${issue.message}`);
    }
    console.log("");
  }

  if (nonBlockingErrors.length > 0) {
    console.log(`❌ ${nonBlockingErrors.length} error${nonBlockingErrors.length === 1 ? "" : "s"}:\n`);
    for (const issue of nonBlockingErrors) {
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

  if (hasBlocking) {
    console.log("❌ VALIDATION FAILED - Required fields missing (commit blocked)\n");
  } else {
    console.log("✨ Validation complete (informational only)\n");
  }
}
