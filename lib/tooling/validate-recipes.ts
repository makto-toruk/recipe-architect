import { validateAllRecipes } from "@/lib/recipe-validator";

async function main(): Promise<void> {
  console.log("\n📋 Validating recipes...\n");

  const results = await validateAllRecipes();

  // Collect all issues by severity
  const allIssues = results.flatMap((r) => r.issues);
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");
  const infos = allIssues.filter((i) => i.severity === "info");

  const totalRecipes = results.length;

  if (allIssues.length === 0) {
    console.log(`✅ All ${totalRecipes} recipes validated successfully!\n`);
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

// Run validation
main().catch(console.error);
