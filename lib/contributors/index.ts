/**
 * Contributor domain types and data loading functions
 * Handles contributor profiles stored in contributors.json
 */

export interface Contributor {
  id: string; // Unique identifier (slug format)
  name: string; // Display name
  motto: string; // Personal tagline or motto
  image: string; // Filename in /public/images/
}

import fs from "fs/promises";
import path from "path";

const contributorsFilePath = path.join(
  process.cwd(),
  "data/contributors.json"
);

/**
 * Load all contributors from contributors.json
 */
export async function loadAllContributors(): Promise<Contributor[]> {
  try {
    const fileContents = await fs.readFile(contributorsFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return data.contributors || [];
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    console.warn("Could not load contributors.json:", error);
    return [];
  }
}

/**
 * Get a single contributor by ID
 */
export async function getContributorById(
  id: string
): Promise<Contributor | null> {
  const contributors = await loadAllContributors();
  return contributors.find((c) => c.id === id) || null;
}

/**
 * Get contributor display name by ID (with fallback)
 */
export async function getContributorName(id: string): Promise<string> {
  const contributor = await getContributorById(id);
  return contributor?.name || id; // Fallback to ID if not found
}
