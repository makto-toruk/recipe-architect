---
id: recipe-slug-name
title: Recipe title
subtitle: Short one-line description (optional, but recommended)
tags: [tag1, tag2, tag3] # Optional, but recommended - helps with categorization
image: recipe-image.jpg # Optional - filename only, must exist in /public/images/
first_made: "2024-01-15" # Required - Use 'YYYY-MM-DD' format with quotes
last_made: "2024-12-20" # Optional - Use 'YYYY-MM-DD' format with quotes
contributor: contributor-id # Optional - References contributor ID from data/contributors.json
source:
  type: Adapted from # Options: "Adapted from", "Inspired by", "Original"
  label: Source Name or Author
  url: "https://example.com/recipe" # Optional - full URL to original recipe
yields: 4-6 # String or number - servings or quantity
time: 15 minutes prep + 40 minutes cook # Human-readable time description
story: | # Optional - personal story or context about the recipe
  This is where you can share the story behind this recipe. How you discovered it,
  memories associated with it, or why it's special to you.
---

## Ingredients

### Main ingredients:

- Ingredient Name (quantity unit)
- Ingredient Name (quantity unit, note or detail)
- Salt (to taste)

### Another section (if needed):

- Ingredient Name (quantity unit)

**Ingredient format rules:**

- Always capitalize the first letter: `Olive oil (2 Tbsp)` not `olive oil (2 Tbsp)`
- Quantity and unit go inside parentheses: `Butter (1/2 cup)` not `1/2 cup butter`
- Notes/details after quantity, separated by comma: `Chicken (2 lbs, boneless, cubed)`
- For "to taste" items, no quantity needed: `Salt (to taste)` or just `Freshly ground black pepper`
- Use standard abbreviations: Tbsp, tsp, oz, lb, etc.

**Examples:**

- Ghee (1 Tbsp)
- Dark chocolate (170g, 70-72% cocoa recommended)
- Chicken thighs (2 lbs, boneless, cut into 1-inch pieces)
- Onion (1 medium, diced)
- Garlic cloves (4, minced)
- Lemon (1, juiced)
- Salt (to taste)
- Freshly ground black pepper

## Special equipment

- Equipment item name (e.g., mandolin, food processor)
- Another item if needed
- **Note:** List actual cooking/prep equipment here, not ingredients like "wooden skewers"

## Instructions

- Preheat oven to 375°F (190°C). Prepare your baking dish by greasing lightly.

- In a large bowl, combine the dry ingredients. Mix well to ensure even distribution.

- For steps with important notes or tips, add nested bullets (these become footnotes):

  - This becomes a footnote shown at the bottom with superscript ¹
  - Multiple nested bullets create multiple footnotes with superscripts ², ³, etc.

- When listing multiple ingredients inline, write: "In a separate bowl, whisk together flour, sugar, salt, and baking powder."

- Continue with each step, keeping instructions clear and actionable. Use present tense and active voice.

## Template usage notes

**Required frontmatter fields:**

- `id` - Must match the filename (without .md extension)
- `title` - Recipe name
- `first_made` - Date in 'YYYY-MM-DD' format
- `source` - At minimum, include type and label
- `yields` - Number of servings or quantity
- `time` - Prep and cook time description

**Recommended frontmatter fields:**

- `subtitle` - Helps users quickly understand the dish
- `tags` - Improves discoverability and organization
- `image` - Makes the recipe more appealing

**Optional frontmatter fields:**

- `last_made` - Track when you last made it
- `source.url` - Link to original recipe
- `story` - Personal context and memories

**File naming:**

- Use kebab-case: `my-amazing-recipe.md`
- Match the `id` field in frontmatter
- Use hyphens, not underscores

**Images:**

- Place in `/public/images/` directory
- Reference by filename only in frontmatter
- Common formats: .jpg, .png, .webp
