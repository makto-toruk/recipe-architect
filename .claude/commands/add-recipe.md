---
description: Add a new recipe following the standard template with proper YAML frontmatter
---

You are helping add a new recipe to the `data/recipes/` directory.

## Workflow

1. **Gather Recipe Information**

   - User provides: URL (prefer print versions), recipe text, or their own recipe
   - If URL provided, fetch and extract the content

2. **Follow the Template**

   - Use `data/recipes/template.md` as the structure and format guide
   - Today's date for `first_made` field: '2025-12-25'
   - All formatting rules are documented in the template

3. **Critical Formatting Reminders**

   - **Sentence case**: Use sentence case for all titles and section headers
     - ✅ Title: `Chicken biryani` (not `Chicken Biryani`)
     - ✅ Section: `### For the marinade:` (not `### For the Marinade:`)
     - Keep proper nouns capitalized: `Thai`, `Amma's`, `Greek`
   - **Ingredients**: Always capitalize first letter, quantity in parentheses
     - ✅ `Olive oil (2 Tbsp)`
     - ❌ `2 Tbsp olive oil`
   - **Fractions**: Use `1 1/2` format (convert Unicode symbols like ½)
   - **Equipment**: Goes in "Special equipment" section, not ingredients

4. **Ask User Before Saving**

   - Filename (suggest kebab-case based on title)
   - Personal story about the recipe?
   - Tags to add? (suggest based on content)
   - Do they have an image? (goes in `/public/images/`)
   - Any modifications needed?

5. **Save & Validate**
   - Save to `data/recipes/[filename].md`
   - Ensure `id` field matches filename (without .md)
   - **Run `npm run validate:recipe [slug]`** and review the output
   - Fix any errors or warnings until the recipe validates cleanly
   - If image mentioned, remind about `/public/images/` placement
