/**
 * Validation types for recipe quality checks
 */

export interface ValidationIssue {
  slug: string;
  severity: "error" | "warning" | "info";
  category: "schema" | "content" | "file";
  field: string;
  message: string;
  blocking?: boolean;
}

export interface ValidationResult {
  slug: string;
  issues: ValidationIssue[];
}
