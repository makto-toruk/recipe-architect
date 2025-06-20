import fs from "node:fs/promises";
import path from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
addErrors(ajv);

// ---------- helper -----------
async function readJSON(file: string) {
  const txt = await fs.readFile(file, "utf8");
  return JSON.parse(txt);
}
async function readDirJSON(dir: string) {
  const files = await fs.readdir(dir);
  return Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map((f) => readJSON(path.join(dir, f)))
  );
}
// ---------- load data ----------
const unitsPath = path.join("data", "units.json");
const ingrPath = path.join("data", "ingredients.json");
const recipeDir = path.join("data", "recipes");

const [units, ingredients, recipes] = await Promise.all([
  readJSON(unitsPath),
  readJSON(ingrPath),
  readDirJSON(recipeDir),
]);

// ---------- compile schemas ----------
const unitsSchema = await readJSON(path.join("schema", "units.schema.json"));
const ingredientsSchema = await readJSON(
  path.join("schema", "ingredients.schema.json")
);
const recipeSchema = await readJSON(path.join("schema", "recipe.schema.json"));

const vUnits = ajv.compile(unitsSchema);
const vIngredients = ajv.compile(ingredientsSchema);
const vRecipe = ajv.compile(recipeSchema);

// ---------- validate structure ----------
let failed = false;

if (!vUnits(units)) {
  failed = true;
  console.error("❌ units.json failed:", vUnits.errors);
}
if (!vIngredients(ingredients)) {
  failed = true;
  console.error("❌ ingredients.json failed:", vIngredients.errors);
}
for (const r of recipes) {
  if (!vRecipe(r)) {
    failed = true;
    console.error(`❌ ${r.id} schema failed:`, vRecipe.errors);
  }
}

// ---------- cross-file checks ----------
const unitSet = new Set(Object.keys(units));
const ingrSet = new Set(Object.keys(ingredients));
for (const r of recipes) {
  // All ingredients must reference known ingredients and units
  for (const ing of r.ingredients) {
    if (!ingrSet.has(ing.ref)) {
      failed = true;
      console.error(`❌ ${r.id}: unknown ingredient ref "${ing.ref}"`);
    }
    if (!unitSet.has(ing.unit)) {
      failed = true;
      console.error(`❌ ${r.id}: unknown unit "${ing.unit}"`);
    }
  }
  // All subrecipes must reference known recipes
  for (const sub of r.subrecipes ?? []) {
    const ref = sub.ref;
    const exists = recipes.some((x) => x.id === ref);
    if (!exists) {
      failed = true;
      console.error(`❌ ${r.id}: subrecipe "${ref}" not found`);
    }
  }
}

// Check that every ingredient's default_unit exists in units.json
for (const [id, ingr] of Object.entries(ingredients)) {
  const ingrObj = ingr as { default_unit?: string };
  if (!unitSet.has(ingrObj.default_unit!)) {
    failed = true;
    console.error(
      `❌ ingredient "${id}" has unknown default_unit "${ingrObj.default_unit}"`
    );
  }
}

// Ensure instructions[].step is strictly increasing or unique
for (const r of recipes) {
  if (Array.isArray(r.instructions)) {
    const steps = r.instructions.map((inst: { step: number }) => inst.step);
    const uniqueSteps = new Set(steps);
    if (uniqueSteps.size !== steps.length) {
      failed = true;
      console.error(`❌ ${r.id}: instructions[].step has duplicates`);
    }
    for (let i = 1; i < steps.length; ++i) {
      if (steps[i] <= steps[i - 1]) {
        failed = true;
        console.error(
          `❌ ${r.id}: instructions[].step not strictly increasing at index ${i}`
        );
        break;
      }
    }
  }
}

if (failed) {
  console.error("⚠️  Validation failed. Fix the issues above.");
  process.exit(1);
}

console.log("✅ All files pass structural & cross-reference validation.");
