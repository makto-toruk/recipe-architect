---
description: Validate a recipe and help fix any issues
---

Validate a recipe in `data/recipes/` and help fix validation issues.

## Workflow

1. **Run Validation**
   - Ask for recipe slug if not provided
   - Run `npm run validate:recipe [slug]`
   - Display results clearly

2. **Explain Issues**
   - **Errors**: Must be fixed (e.g., missing required fields)
   - **Warnings**: Should be fixed (e.g., invalid date formats)
   - **Info**: Optional improvements (e.g., missing recommended fields)

3. **Help Fix Issues**
   - Read the recipe file to understand context
   - Suggest specific fixes for each issue
   - Ask user if they want you to apply fixes
   - Re-validate after changes

## Common Issues

- **Missing fields**: Add subtitle, image, tags (recommended but optional)
- **Ingredients without quantity**: Add `(to taste)` or specific amount
- **Invalid dates**: Must be `YYYY-MM-DD` format with quotes
- **Image not found**: Add image to `/public/images/` or remove image field

## Validation Categories

- **schema**: Frontmatter fields and formats
- **content**: Ingredients and instructions quality
- **file**: Filename conventions and image existence
