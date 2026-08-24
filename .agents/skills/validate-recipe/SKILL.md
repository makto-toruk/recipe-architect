---
name: validate-recipe
description: Run this repository's validator for one recipe, explain its findings, and apply requested fixes without changing unrelated recipe content.
---

# Validate Recipe

Validate a recipe in `data/recipes/` by slug.

1. Resolve the slug from the user's request. If it is missing or ambiguous, inspect `data/recipes/` for likely matches before asking for clarification.
2. Run `npm run validate:recipe -- <slug>` and present errors, warnings, and informational findings distinctly.
3. Read the recipe and relevant validator code when needed to explain the exact cause and propose a specific correction.
4. If the user asked to fix the recipe, make the narrowest appropriate changes and rerun validation until it exits cleanly or the remaining finding requires user input. If the user asked only to validate or diagnose, do not edit files.

Interpret severities as follows:

- Errors are blocking defects, such as missing required fields.
- Warnings should normally be resolved, such as invalid date formats.
- Informational findings are optional quality improvements and must not be presented as mandatory.

Common corrections include adding a real quantity or `(to taste)` to an ingredient, quoting dates in `YYYY-MM-DD` form, making the frontmatter `id` match the filename, and removing a `gallery` field whose directory does not exist. Create a gallery directory only when image files are actually available; do not create an empty directory merely to silence validation.
