import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import type { Root, Heading, List, ListItem, Paragraph } from "mdast";
import Fraction from "fraction.js";
import type {
  MarkdownRecipe,
  MarkdownIngredient,
  MarkdownInstruction,
} from "@/types/markdown";

const markdownDir = path.join(process.cwd(), "data/recipes/markdown");

/**
 * Get all markdown recipe slugs (filenames without .md extension)
 */
export async function getAllMarkdownRecipeSlugs(): Promise<string[]> {
  const files = await fs.readdir(markdownDir);
  return files
    .filter((name) => name.endsWith(".md") && name !== "template.md")
    .map((name) => name.replace(/\.md$/, ""));
}

/**
 * Load and parse a markdown recipe by slug
 */
export async function loadMarkdownRecipeBySlug(
  slug: string
): Promise<MarkdownRecipe | null> {
  try {
    const filePath = path.join(markdownDir, `${slug}.md`);
    const fileContents = await fs.readFile(filePath, "utf8");

    // Parse frontmatter
    const { data: frontmatter, content } = matter(fileContents);

    // Parse markdown content to AST
    const ast = remark().parse(content) as Root;

    // Extract ingredients and instructions from AST
    const ingredients = parseIngredients(ast);
    const instructions = parseInstructions(ast);

    return {
      id: frontmatter.id || slug,
      title: frontmatter.title,
      subtitle: frontmatter.subtitle,
      tags: frontmatter.tags,
      image: frontmatter.image,
      first_made: frontmatter.first_made,
      last_made: frontmatter.last_made,
      story: frontmatter.story,
      source: frontmatter.source,
      time: frontmatter.time,
      yields: frontmatter.yields,
      ingredients,
      instructions,
    };
  } catch (error) {
    // Return null if file not found (expected for non-existent recipes)
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    // Log other errors
    console.error(`Failed to load markdown recipe: ${slug}`, error);
    return null;
  }
}

/**
 * Parse ingredients from markdown AST
 */
function parseIngredients(ast: Root): MarkdownIngredient[] {
  const ingredients: MarkdownIngredient[] = [];
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
): MarkdownIngredient | null {
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

/**
 * Parse instructions from markdown AST
 */
function parseInstructions(ast: Root): MarkdownInstruction[] {
  const instructions: MarkdownInstruction[] = [];
  let inInstructionsSection = false;
  let currentStep: number | null = null;
  let currentText: string[] = [];
  let currentNote: string | undefined;

  const saveCurrentInstruction = () => {
    if (currentStep !== null && currentText.length > 0) {
      instructions.push({
        step: currentStep,
        text: currentText.join(" ").trim(),
        note: currentNote,
      });
    }
  };

  for (let i = 0; i < ast.children.length; i++) {
    const node = ast.children[i];

    // Find ## Instructions heading
    if (node.type === "heading" && node.depth === 2) {
      const text = extractText(node);
      if (text === "Instructions") {
        inInstructionsSection = true;
        continue;
      } else if (inInstructionsSection) {
        // Save last instruction before leaving section
        saveCurrentInstruction();
        break;
      }
      continue;
    }

    if (!inInstructionsSection) continue;

    // H3 headings start new instruction steps
    if (node.type === "heading" && node.depth === 3) {
      // Save previous instruction if exists
      saveCurrentInstruction();

      // Parse new instruction header: "1. Step Name" or just "1."
      const headerText = extractText(node);
      const match = headerText.match(/^(\d+)\./);
      currentStep = match ? parseInt(match[1], 10) : instructions.length + 1;
      currentText = [];
      currentNote = undefined;
      continue;
    }

    // Only process content if we have a current step
    if (currentStep === null) continue;

    // Collect paragraph content for current instruction
    if (node.type === "paragraph") {
      const text = extractText(node).trim();

      // Check if this looks like a footnote (text in parentheses)
      if (text.match(/^\(.+\)$/)) {
        currentNote = text.replace(/^\(|\)$/g, "");
      } else if (text) {
        currentText.push(text);
      }
      continue;
    }

    // Handle bullet lists within instructions
    if (node.type === "list") {
      for (const item of (node as List).children) {
        const text = extractText(item).trim();
        if (text) {
          currentText.push("• " + text);
        }
      }
    }
  }

  // Save last instruction
  saveCurrentInstruction();

  return instructions;
}

/**
 * Extract plain text from an AST node recursively
 */
function extractText(node: any): string {
  if (node.type === "text") {
    return node.value;
  }

  if (node.type === "inlineCode") {
    return node.value;
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractText).join("");
  }

  return "";
}
