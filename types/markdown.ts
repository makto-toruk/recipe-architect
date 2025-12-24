/**
 * Type definitions for markdown-based recipes
 * These types represent the structure of recipes parsed from markdown files
 * with YAML frontmatter.
 */

export interface MarkdownRecipe {
  // Frontmatter metadata
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  image?: string;
  first_made?: string; // YYYY-MM-DD format
  last_made?: string; // YYYY-MM-DD format
  story?: string;
  source?: {
    type: "Adapted from" | "Inspired by";
    label: string;
    url?: string;
  };
  time?: string;
  yields?: string;

  // Parsed content from markdown body
  ingredients: MarkdownIngredient[];
  instructions: MarkdownInstruction[];
}

export interface MarkdownIngredient {
  quantity: string; // Display string: "2 1/2", "1", etc.
  unit: string; // Display string: "cups", "lbs", "each", etc.
  name: string; // Ingredient name: "flour", "chicken thighs", etc.
  note?: string; // Optional notes: "sifted", "boneless", etc.
  group?: string; // Optional group heading: "For the Marinade", etc.
}

export interface MarkdownInstruction {
  step: number; // Step number
  text: string; // Instruction text
  note?: string; // Optional footnote
}
