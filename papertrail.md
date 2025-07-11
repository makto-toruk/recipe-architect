# recipe-architect — Paper Trail

Reverse-chronological log of notable decisions, fixes, and milestones.

---

## 2025-06-20

- **Landing page with recipe grid**

- **Sub-recipe support and rendering**

- **Collapsible sub-recipe sections.**  
  `RecipeInstructions` now wraps each sub-recipe in an always-open `<details>` block.

- **Loader upgrade.**  
  `loadRecipeBySlug` can now resolve any `subrecipes` array and returns fully processed sub-recipe data alongside the main recipe.

---

## 2025-06-19

- **Switched to Husky v9 minimal hooks.**  
  Removed `husky.sh` sourcing; hook is now a two-line shell script.
- Added first recipe.
- Figured out tailwind installation.
- Page layout design iterations.
- Support fractional quantities. Feel weird about this choice, since the user may have to always think of fractions. But could be easy for agents.
- Deploy on Vercel

---

## 2025-06-18

- **Chose validation stack:** Node + TypeScript + AJV.
- **Outlined three-layer data model (units, ingredients, recipes).**

---

## 2025-06-17

- Project idea conceived.
