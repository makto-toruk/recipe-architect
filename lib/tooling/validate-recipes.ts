import { validateAllRecipes } from "@/lib/recipe-validator";
import { displayValidationResults } from "./validation-formatter";

async function main(): Promise<void> {
  console.log("\n📋 Validating recipes...\n");

  const results = await validateAllRecipes();

  displayValidationResults(results, { showRecipeCount: true });
}

// Run validation
main().catch(console.error);
