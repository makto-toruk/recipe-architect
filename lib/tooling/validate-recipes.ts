import { validateAllRecipes } from "@/lib/recipe-validator";
import { displayValidationResults, hasBlockingIssues } from "./validation-formatter";

async function main(): Promise<void> {
  console.log("\n📋 Validating recipes...\n");

  const results = await validateAllRecipes();
  const hasBlocking = hasBlockingIssues(results);

  displayValidationResults(results, {
    showRecipeCount: true,
    hasBlockingIssues: hasBlocking
  });

  if (hasBlocking) {
    process.exit(1);
  }
}

// Run validation
main().catch(console.error);
