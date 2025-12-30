import type { Ingredient } from "@/lib/recipe-types";

/**
 * Groups ingredients by their group field, preserving order.
 * Returns array of [groupName, ingredients[]] tuples.
 * Ungrouped ingredients come first (empty string key), then named groups.
 */
function groupIngredients(ingredients: Ingredient[]): [string, Ingredient[]][] {
  // Group by group field
  const grouped = ingredients.reduce(
    (acc, ing) => {
      const groupName = ing.group || "";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(ing);
      return acc;
    },
    {} as Record<string, Ingredient[]>
  );

  // Preserve order: ungrouped first, then named groups
  const allGroups = Object.keys(grouped);
  const emptyGroup = allGroups.filter((g) => g === "");
  const namedGroups = allGroups.filter((g) => g !== "");
  const sortedGroups = [...emptyGroup, ...namedGroups];

  return sortedGroups.map((groupName) => [groupName, grouped[groupName]]);
}

/**
 * Formats a single ingredient for clipboard.
 * Format: "- {name} ({quantity} {unit})" or "- {name}" if no quantity/unit
 */
function formatIngredient(ingredient: Ingredient): string {
  const { name, quantity, unit } = ingredient;

  // Build quantity string (quantity + unit, trimmed)
  const quantityParts = [quantity, unit].filter(Boolean).join(" ").trim();

  // If we have quantity/unit, include in parentheses
  if (quantityParts) {
    return `- ${name} (${quantityParts})`;
  }

  // Otherwise just the name
  return `- ${name}`;
}

/**
 * Formats ingredient list for clipboard.
 * Creates markdown bullet list with section headers (plain text, no ###).
 * Excludes cooking notes (only includes name, quantity, unit).
 */
export function formatIngredientsForClipboard(ingredients: Ingredient[]): string {
  const groupedIngredients = groupIngredients(ingredients);
  const sections: string[] = [];

  for (const [groupName, items] of groupedIngredients) {
    const sectionLines: string[] = [];

    // Add group header if named (plain text, no markdown formatting)
    if (groupName) {
      sectionLines.push(`${groupName}:`);
      sectionLines.push(""); // Blank line after header
    }

    // Format each ingredient (excluding notes)
    const formattedItems = items.map(formatIngredient);
    sectionLines.push(...formattedItems);

    sections.push(sectionLines.join("\n"));
  }

  // Join sections with double newlines
  return sections.join("\n\n");
}

/**
 * Copies text to clipboard using modern API with fallback.
 * Returns true on success, false on failure.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);

    return successful;
  } catch (err) {
    console.warn("Failed to copy to clipboard:", err);
    return false;
  }
}
