import { validateRecipe } from "@/lib/recipe-validator";
import { displayValidationResults } from "./validation-formatter";

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("\n❌ Error: Recipe slug required\n");
    console.log("Usage: npm run validate:recipe <slug>\n");
    console.log("Example: npm run validate:recipe chicken-biryani\n");
    process.exit(1);
  }

  const slug = args[0];

  console.log(`\n📋 Validating recipe: ${slug}...\n`);

  const result = await validateRecipe(slug);

  displayValidationResults([result], { showRecipeCount: false });
}

// Run validation
main().catch((error) => {
  console.error("\n❌ Validation failed:", error.message, "\n");
  process.exit(1);
});
