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

7. **Fizzy Card Integration (Optional)**

   After creating the local markdown file, check for Fizzy API credentials:

   - Read the `.env` file (if it exists) using the Read tool
   - Extract: `FIZZY_API_TOKEN`, `FIZZY_ACCOUNT_SLUG`, `FIZZY_BOARD_ID`
   - If ANY are missing/empty, skip Fizzy integration and inform user:
     - "Fizzy integration skipped. To enable, configure credentials in `.env` file."
     - "See `.env.example` for setup instructions."

   **If all credentials exist, proceed:**

   a) **Find the Grocery Card**

   Make API request to find cards with the "golden-grocery" tag:
   ```bash
   curl -X GET "https://app.fizzy.do/{ACCOUNT_SLUG}/cards.json" \
     -H "Authorization: Bearer {API_TOKEN}" \
     -H "Accept: application/json"
   ```

   - Parse JSON response to find card(s) with "golden-grocery" in the `tags` array
   - Extract the `number` field (card number) from the matching card
   - If no card with "golden-grocery" tag found:
     - Inform: "No card with 'golden-grocery' tag found. Please tag a Fizzy card with 'golden-grocery' for grocery lists."
     - Skip Fizzy integration, exit gracefully
   - If multiple cards have the tag, use the first one
   - If API call fails (401, 404, 500, network error):
     - Log error message
     - Skip Fizzy integration
     - Suggest: "Check FIZZY_API_TOKEN and FIZZY_ACCOUNT_SLUG in .env file"

   b) **Prepare Shopping Items as Checklist Steps**

   Transform the Shopping List section (Section 2) into step format:
   - Each line item becomes one step: `{Item}: {quantity}`
   - Optionally prefix with category for organization

   Examples:
   - `Garlic: 2 heads`
   - `Chicken breasts: 4 breasts (24 oz)`
   - `Quinoa: 1 1/2 cups`
   - `Cumin seeds: 2 tsp`

   c) **Create Steps in Fizzy Card**

   For each shopping item, make a POST request:
   ```bash
   curl -X POST "https://app.fizzy.do/{ACCOUNT_SLUG}/cards/{CARD_NUMBER}/steps.json" \
     -H "Authorization: Bearer {API_TOKEN}" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{
       "step": {
         "content": "Carrots: 2 medium",
         "completed": false
       }
     }'
   ```

   **Error handling:**
   - If individual step creation fails, continue with remaining steps
   - Track successful vs failed requests
   - If >50% fail, warn: "Many items failed to sync. Check API credentials."

   d) **Confirm Success**

   Display summary:
   - Count: "Added {N} items to Fizzy card #{CARD_NUMBER}"
   - Link: "View in Fizzy: https://app.fizzy.do/{ACCOUNT_SLUG}/cards/{CARD_NUMBER}"
   - If partial success: "Added {X} of {Y} items (check Fizzy for details)"

8. **Final Summary to User**

   Provide combined status:
   - "Local grocery list: `grocery_lists/{YYYYMMDD}.md`"
   - IF Fizzy enabled: "Fizzy card updated with {N} items: [View Card](link)"
   - IF Fizzy skipped: "Fizzy integration skipped (configure .env to enable)"

## Tips
- Combine similar ingredients (e.g., "butter" across multiple recipes)
- Note substitutions if mentioned in recipes (e.g., "buttermilk OR yogurt")
- Flag optional ingredients clearly
- Round up quantities to practical shopping amounts
- **Fizzy Integration**: Set up `.env` with Fizzy credentials to auto-sync grocery lists to a golden-tagged card for mobile shopping
