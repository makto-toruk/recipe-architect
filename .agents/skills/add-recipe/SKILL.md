---
name: add-recipe
description: Add a recipe from a URL, supplied text, or the user's own recipe to data/recipes, following this repository's Markdown template and validation rules.
---

# Add Recipe

Create `data/recipes/<slug>.md` from the user's source material.

## Repository requirements

- Read `data/recipes/template.md` before drafting; it is the source of truth for frontmatter and body structure.
- Use sentence case for recipe titles and ingredient section headings, while preserving proper nouns.
- Format ingredients as `Ingredient (quantity unit, notes)`, capitalizing the ingredient. Convert Unicode fractions to plain forms such as `1/2` and `1 1/2`.
- Put cooking tools in `## Special equipment`, never in the ingredient list.
- Use a kebab-case filename and make the frontmatter `id` exactly match its basename.
- Set `first_made` to today's date in quoted `YYYY-MM-DD` form unless the user supplies the actual first-made date.
- Preserve attribution and the source URL when adapting a published recipe. Prefer a print-view URL when the provided site exposes one.

## Workflow

1. Read or retrieve the supplied recipe material and extract the ingredients, instructions, yield, timing, and attribution without inventing missing facts.
2. Draft the recipe from the repository template. Suggest a slug and useful tags based on the content.
3. Before writing, resolve user-owned details that cannot be inferred: the personal story, desired modifications, tags, and whether images should be associated with the recipe. Show the proposed filename as part of this check.
4. Write the agreed recipe to `data/recipes/<slug>.md`.
5. Run `npm run validate:recipe -- <slug>`. Fix issues caused by the new recipe and rerun until it exits cleanly. Clearly report any issue that requires information only the user can provide.

If the user has images, use `public/images/<slug>/` and numeric filename prefixes such as `01-hero.jpg` and `02-prep.jpg`; the alphabetically first image is the hero/card image. Do not add a `gallery` field until the referenced directory exists.
