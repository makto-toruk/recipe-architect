# recipe-architect — Paper Trail

Reverse-chronological log of notable decisions, fixes, and milestones.

---

## 2025-12-24

- **Complete migration from JSON to markdown-based recipes.**
  Replaced complex JSON schema system with simple YAML frontmatter + markdown content. Ingredients now use clean format: `Name (quantity unit, note)`. Instructions support footnotes via parentheses.

- **Simplified ingredient parsing.**
  Removed centralized ingredient/unit databases. Parse quantities and units directly from markdown using `fraction.js`.

- **Unified to markdown-only system.**
  Deleted all JSON recipes, schemas, validation scripts, and database files. Removed old components and utils. App is now 45% smaller (recipe pages: 7.63kB → 4.16kB).

- **Renamed recipe.**
  `ammas-chicken-chaaps` → `ammas-chicken-curry` with proper metadata from original source.

- **Enforced hyphenated filenames.**
  Validation now errors on underscored filenames. Markdown files must use hyphens (e.g., `my-recipe.md` not `my_recipe.md`).

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
