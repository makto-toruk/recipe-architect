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
Create a simple, flat shopping list - just items, no categories.

**Format:**
```markdown
## Shopping List

- Item: total quantity needed
- Item: total quantity needed
- Item: total quantity needed
```

**Important formatting rules:**
- Each item on its own line starting with `-`
- Keep it practical for shopping (e.g., "2 heads of garlic" not "20 cloves")
- No categories, headers, or groupings - just a flat list
- This format is optimized for parsing by the Fizzy sync script

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

7. **Fizzy Card Integration (Optional)**

   After creating the local markdown file, sync to Fizzy using the built-in script:

   ```bash
   npm run fizzy:sync-grocery grocery_lists/{YYYYMMDD}.md
   ```

   The script will:
   - Check for Fizzy credentials in `.env` file
   - Find the card tagged with "golden-grocery"
   - Extract shopping items from the markdown file
   - Add all items as checklist steps to the card
   - Display a summary with link to the Fizzy card

   If credentials are missing or the card is not found, the script will display helpful error messages.

8. **Final Summary to User**

   Provide combined status:
   - "Local grocery list: `grocery_lists/{YYYYMMDD}.md`"
   - Output from the Fizzy sync script (if any)

## Tips
- Combine similar ingredients (e.g., "butter" across multiple recipes)
- Note substitutions if mentioned in recipes (e.g., "buttermilk OR yogurt")
- Flag optional ingredients clearly
- Round up quantities to practical shopping amounts
- **Fizzy Integration**: Set up `.env` with Fizzy credentials to auto-sync grocery lists to a golden-tagged card for mobile shopping
