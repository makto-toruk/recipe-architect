import type { Root, List } from "mdast";
import type { Ingredient } from "@/lib/recipe-types";
import { extractText } from "./ast-parser";

/**
 * Parse ingredients from markdown AST
 */
export function parseIngredients(ast: Root): Ingredient[] {
  const ingredients: Ingredient[] = [];
  let inIngredientsSection = false;
  let currentGroup: string | undefined;

  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];

    // Find ## Ingredients heading
    if (node.type === "heading" && node.depth === 2) {
      const text = extractText(node);
      if (text === "Ingredients") {
        inIngredientsSection = true;
      } else if (inIngredientsSection) {
        // Exit ingredients section at next H2
        break;
      }
      continue;
    }

    if (!inIngredientsSection) continue;

    // Track H3 subheadings as groups
    if (node.type === "heading" && node.depth === 3) {
      currentGroup = extractText(node).replace(/:$/, ""); // Remove trailing colon
      continue;
    }

    // Parse list items as ingredients
    if (node.type === "list") {
      for (const item of (node as List).children) {
        const text = extractText(item);
        const parsed = parseIngredientLine(text, currentGroup);
        if (parsed) {
          ingredients.push(parsed);
        }
      }
    }
  }

  return ingredients;
}

/**
 * Parse a single ingredient line
 * Expected format: "Ingredient Name (quantity unit)"
 * Examples:
 *   - "Ghee (1 Tbsp)"
 *   - "Dark chocolate (170g)"
 *   - "Salt (to taste)"
 *   - "Chicken thighs (2 lbs, boneless)"
 */
function parseIngredientLine(
  line: string,
  group?: string
): Ingredient | null {
  // Skip empty lines
  if (!line || !line.trim()) {
    return null;
  }

  line = line.trim();

  // Match pattern: "Name (quantity details)"
  const match = line.match(/^(.+?)\s*\(([^)]+)\)$/);

  if (!match) {
    // No parentheses found - treat whole line as ingredient name with no quantity
    return {
      quantity: "",
      unit: "",
      name: line,
      note: undefined,
      group,
    };
  }

  const [_, name, quantityPart] = match;

  // Skip if name is empty
  if (!name || !name.trim()) {
    return null;
  }

  // Parse the quantity part - try to extract quantity and unit
  // Examples: "1 Tbsp", "170g", "2 lbs, boneless", "to taste"
  const qtyMatch = quantityPart.match(/^([\d\s\/\.]+)\s*(.+)$/);

  if (qtyMatch) {
    const [__, qtyStr, rest] = qtyMatch;
    // Split rest into unit and note (if there's a comma)
    const [unit, note] = rest.split(',').map(s => s.trim());

    return {
      quantity: qtyStr.trim(),
      unit: normalizeUnit(unit),
      name: name.trim(),
      note: note,
      group,
    };
  }

  // No quantity number found - treat whole quantityPart as unit/note
  // (e.g., "to taste", "optional")
  return {
    quantity: "",
    unit: quantityPart.trim(),
    name: name.trim(),
    note: undefined,
    group,
  };
}


/**
 * Normalize unit variations (tablespoon/Tbsp/tbsp → tbsp)
 */
function normalizeUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    tablespoon: "Tbsp",
    tablespoons: "Tbsp",
    tbsp: "Tbsp",
    teaspoon: "tsp",
    teaspoons: "tsp",
    cup: "cup",
    cups: "cup",
    ounce: "oz",
    ounces: "oz",
    pound: "lb",
    pounds: "lbs",
    lb: "lb",
    lbs: "lbs",
    gram: "g",
    grams: "g",
    g: "g",
    gm: "g",
    kg: "kg",
    kilogram: "kg",
    kilograms: "kg",
    ml: "ml",
    milliliter: "ml",
    milliliters: "ml",
    liter: "L",
    liters: "L",
    inch: "inch",
    inches: "inch",
  };

  const normalized = unitMap[unit.toLowerCase()];
  return normalized || unit;
}
