// scripts/generate-types.ts
import { compile } from "json-schema-to-typescript";
import fs from "fs";
import path from "path";

async function generateTypes() {
  const schemaDir = "schema";

  // Check if schema directory exists
  if (!fs.existsSync(schemaDir)) {
    console.error(`Schema directory '${schemaDir}' does not exist`);
    return;
  }

  // Read all .schema.json files
  const files = fs
    .readdirSync(schemaDir)
    .filter((file) => file.endsWith(".schema.json"));

  if (files.length === 0) {
    console.log("No .schema.json files found in schema directory");
    return;
  }

  let output =
    "/* eslint-disable */\n// Auto-generated types from JSON schemas\n\n";

  for (const file of files) {
    try {
      const filePath = path.join(schemaDir, file);
      const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
      // Convert filename to better type name
      // e.g., "recipe.schema.json" -> "Recipe"
      let typeName = path.basename(file, ".schema.json");
      typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);

      // Override the schema title to use our clean name
      const cleanSchema = { ...schema, title: typeName };
      const types = await compile(cleanSchema, typeName);
      output += types + "\n";
      console.log(`✓ Generated types for ${file}`);
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error);
    }
  }

  // Ensure types directory exists
  const typesDir = path.dirname("types/index.ts");
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  fs.writeFileSync("types/generated.ts", output);
  console.log("Types generated successfully in types/generated.ts");

  // Create or update the main index file with re-exports and manual types
  const indexContent = `// Re-export all generated types
export * from './generated';

// Import types for use in this file
import type { Recipe, Ingredients, Units } from './generated';

// Manual application types
export interface LoadedRecipe {
  recipe: Recipe;
  ingredients: Ingredients;
  units: Units;
}

// Add other manual types here...
`;

  // Only create index.ts if it doesn't exist (don't overwrite manual additions)
  if (!fs.existsSync("types/index.ts")) {
    fs.writeFileSync("types/index.ts", indexContent);
    console.log("Created types/index.ts with manual types");
  } else {
    console.log("types/index.ts already exists - not overwriting");
  }
}

generateTypes().catch(console.error);
