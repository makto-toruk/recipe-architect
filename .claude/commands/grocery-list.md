---
description: Generate a grocery list from multiple recipes
---

You are helping create a comprehensive grocery list from multiple recipes.

## Instructions

1. The user will provide recipe names (e.g., "ratatouille, pommes anna, tandoori chicken")

2. Read each recipe file from `data/recipes/` directory
   - If a recipe file doesn't exist, inform the user and ask which recipes they meant

3. Extract all ingredients from each recipe

4. Create a grocery list file at `grocery_lists/YYYYMMDD.md` (use today's date in format YYYYMMDD) with these sections:

### Section 1: Verification - Ingredient Breakdown
Create a numbered list of all unique ingredients across all recipes. For each ingredient:
- List which recipes use it
- Show the quantity needed by each recipe
- Calculate and show the **total quantity** needed

Example:
```
1. **Garlic**
   - Ratatouille: 8 cloves, minced
   - Pommes Anna: 2 cloves, smashed
   - Tandoori Chicken: 8-9 cloves
   - **Total: ~20 cloves (2 heads)**

2. **Butter**
   - Pommes Anna: 8 tbsp
   - Tandoori Chicken: 4 tbsp
   - **Total: 12 tbsp (1.5 sticks)**
```

### Section 2: Shopping List
Create a simple, scannable shopping list organized by category:
- Regular Groceries
  - Vegetables & Produce
  - Dairy & Protein
  - Pantry
- Indian Store (if applicable)

Format: `- Item: total quantity needed`

Keep it practical for shopping (e.g., "2 heads of garlic" not "20 cloves")

### Section 3: Double-Check
For each recipe, verify:
- Count total ingredients needed
- Confirm all ingredients are in the shopping list
- Mark with ✅ if complete

Example:
```
✅ Ratatouille - All 12 ingredients accounted for
✅ Pommes Anna - All 6 ingredients accounted for
```

Add final status: "All recipes can be completed with this grocery list" or note any missing items.

5. Follow the template structure in `grocery_lists/template.md`

6. Save the file and confirm to the user with the filename

## Tips
- Combine similar ingredients (e.g., "butter" across multiple recipes)
- Note substitutions if mentioned in recipes (e.g., "buttermilk OR yogurt")
- Flag optional ingredients clearly
- Round up quantities to practical shopping amounts
