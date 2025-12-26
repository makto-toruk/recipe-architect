/**
 * Type definitions for recipe domain
 * These types represent the structure of recipes and their components.
 */

export interface Recipe {
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
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface Ingredient {
  quantity: string; // Display string: "2 1/2", "1", etc.
  unit: string; // Display string: "cups", "lbs", "each", etc.
  name: string; // Ingredient name: "flour", "chicken thighs", etc.
  note?: string; // Optional notes: "sifted", "boneless", etc.
  group?: string; // Optional group heading: "For the Marinade", etc.
}

export interface Instruction {
  step: number; // Step number
  text: string; // Instruction text
  notes?: string[]; // Optional footnotes (from nested bullets)
}

export interface RecipeCard {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  tags?: string[];
  first_made?: string;
  last_made?: string;
}
