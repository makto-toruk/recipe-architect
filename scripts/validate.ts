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
  // ingredient refs & units
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
  // subrecipe IDs
  for (const sub of r.subrecipes ?? []) {
    const exists = recipes.some((x) => x.id === sub);
    if (!exists) {
      failed = true;
      console.error(`❌ ${r.id}: subrecipe "${sub}" not found`);
    }
  }
}

if (failed) {
  console.error("⚠️  Validation failed. Fix the issues above.");
  process.exit(1);
}

console.log("✅ All files pass structural & cross-reference validation.");
