---
name: grocery-list
description: Generate a dated, practical grocery-list Markdown file by combining ingredients from multiple recipes in this repository.
---

# Grocery List

Build one consolidated grocery list from recipes in `data/recipes/`.

## Workflow

1. Resolve each requested recipe name to a recipe file. If a name is ambiguous or missing, report the close matches and get the user's choice instead of guessing.
2. Read `grocery_lists/template.md` and every selected recipe.
3. Extract all ingredients, retaining recipe-specific quantities, preparation notes, alternatives, and optional status.
4. Normalize equivalent ingredients and compatible units, but do not combine distinct forms when that would make the list inaccurate. Show uncertain or incompatible totals explicitly.
5. Write `grocery_lists/YYYYMMDD.md` using the current local date and the structure below.

## Required output

The verification section must number every unique ingredient, identify each recipe that uses it, show each recipe's amount, and give a calculated total. Convert the total to a practical purchase amount where reasonable, while retaining enough detail to audit the arithmetic.

The `## Shopping List` section must be a flat parseable list with no subheadings or categories:

```markdown
## Shopping List

- Item: practical total quantity
- Item: practical total quantity
```

Mark optional ingredients clearly. Represent alternatives without implying both must be purchased.

The final double-check must count the ingredients in each source recipe, confirm every one is represented, and give a completion status. Do not claim completeness when an amount or ingredient remains unresolved.

After saving, report the path. Only when the user asks to sync the list to Fizzy, run:

```bash
npm run fizzy:sync-grocery -- grocery_lists/YYYYMMDD.md
```

Report the sync result and card link if available. A local grocery list is still a successful result when Fizzy credentials or the tagged card are unavailable.
