# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Recipe Architect is a **markdown-based recipe application** built with Next.js 16, featuring static site generation, recipe validation tooling, and a clean separation between backend parsing/validation logic and frontend display components.

## Commands

### Development

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build (generates static pages)
npm run start        # Serve production build
```

### Validation

```bash
npm run validate            # Run recipe quality validation (all recipes)
                            # Reports: errors, warnings, info by severity
                            # Pre-commit hook runs this + build automatically
npm run validate:recipe     # Validate a single recipe by slug
                            # Usage: npm run validate:recipe [recipe-slug]
```

### Pre-commit Hook

The Husky pre-commit hook automatically runs:
1. `npm run validate` - Blocks if required fields are missing
2. `npm run build` - Blocks if TypeScript errors or build failures occur

**Skip pre-commit checks** (use sparingly):
```bash
git commit --no-verify -m "your message"
# or shorthand:
git commit -n -m "your message"
```

### Claude Commands

When using Claude Code, the following commands are available:

```bash
/validate-recipe     # Validate a recipe and help fix any issues
/add-recipe          # Add a new recipe following the standard template
/grocery-list        # Generate a shopping list from multiple recipes
```

## Architecture

### Backend/Frontend Separation

The codebase maintains strict separation between:

- **Backend** (`/lib`): Recipe parsing, validation, file I/O - never imports React
- **Frontend** (`/app`, `/components`): Next.js App Router pages and React UI components
- **Data** (`/data`): All content (markdown recipes, about page)
- **Public** (`/public`): Static assets served by Next.js (images must live here)

### Recipe Data Flow

```
Markdown files (data/recipes/*.md)
  ↓
Recipe Parser (lib/recipe-parser/)
  → Frontmatter extraction (YAML)
  → AST parsing (remark)
  → Ingredient parsing (quantity, unit, name, notes)
  → Instruction parsing (step numbers, text, footnotes)
  ↓
Recipe Types (lib/recipe-types/)
  → Recipe, Ingredient, Instruction interfaces
  ↓
Frontend Components (components/recipe-display/)
  → RecipeMetadata, RecipeIngredients, RecipeInstructions
```

### Key Modules

**`lib/recipe-parser/`** - Modular parser split into focused files:

- `index.ts`: Public API (`parseRecipe()`, `getAllRecipeSlugs()`, `loadAllRecipes()`)
- `frontmatter-parser.ts`: YAML frontmatter extraction with gray-matter
- `ingredient-parser.ts`: Parse "Ingredient Name (quantity unit, note)" format
- `instruction-parser.ts`: Parse bullet list as numbered steps
- `ast-parser.ts`: Helper utilities for markdown AST traversal

**`lib/recipe-validator/`** - Validation with categorized issues (schema/content/file):

- `index.ts`: Orchestrates all validators (`validateRecipe()`, `validateAllRecipes()`)
- `schema-validator.ts`: Required fields, date formats (YYYY-MM-DD)
- `content-validator.ts`: Ingredients/instructions quality checks
- `file-validator.ts`: Filename conventions (hyphens not underscores), image existence

**`lib/tooling/`** - CLI development tools:

- `validate-recipes.ts`: Console wrapper for validation with formatted output

**`lib/recipe-types/`** - Shared domain types:

- `Recipe`, `Ingredient`, `Instruction`, `RecipeCard` interfaces

### Recipe Markdown Format

Recipes use YAML frontmatter + markdown body:

```markdown
---
id: recipe-slug
title: Recipe title  # IMPORTANT: Use sentence case, not title case
subtitle: Short description
tags: [tag1, tag2]
image: filename.jpg
first_made: "2024-01-15" # YYYY-MM-DD format
last_made: "2024-12-20" # YYYY-MM-DD format
source:
  type: Adapted from | Inspired by
  label: Source Name
  url: https://...
yields: 4-6
time: 15 minutes prep + 40 minutes cook
story: Personal story about the recipe...
---

## Ingredients

### Section name (optional):  # Use sentence case for section headers

- Ingredient Name (quantity unit)
- Ingredient Name (quantity unit, note)
- Salt (to taste)

## Instructions

- Step description text. Nested bullets are footnotes:

  - This appears at bottom with superscript ¹
  - This appears at bottom with superscript ²

- For lists, write inline: "In a bowl, mix flour, sugar, and salt."
```

### Component Structure

**Pages** (`app/`):

- `app/page.tsx`: Recipe grid homepage
- `app/recipes/page.tsx`: All recipes list
- `app/recipes/[slug]/page.tsx`: Individual recipe detail (SSG with `generateStaticParams`)
- `app/about/page.tsx`: About page

**Components** (`components/`):

- `SiteHeader.tsx`: Site-wide navigation (logo, menu, focus mode toggle)
- `RecipeCard.tsx`: Recipe card for grid/list views
- `recipe-display/RecipePageClient.tsx`: Client component wrapper for recipe pages
- `recipe-display/RecipeMetadata.tsx`: Recipe header (title, image, story, tags, dates)
- `recipe-display/RecipeIngredients.tsx`: Ingredient list with localStorage progress tracking
- `recipe-display/RecipeInstructions.tsx`: Numbered instruction steps with footnotes
- `utils/formatDate.ts`: Date formatting for UI (frontend utility)

### Focus Mode

Recipe pages include an interactive Focus Mode feature:

- **Toggle**: Available in SiteHeader on recipe pages only
- **Hides distractions**: Image, story, tags, dates, and source information
- **Enables checkboxes**: Interactive checkboxes for both ingredients and instructions
- **Progress tracking**: Checkbox state persists to localStorage per recipe
- **Clear progress**: Button appears when items are checked to reset progress
- **Responsive layout**:
  - Desktop: Side-by-side layout (1/3 ingredients, 2/3 instructions)
  - Mobile: Stacked single-column layout
- **Persistence**: Focus mode toggle state saved per recipe in localStorage

### Path Alias

All imports use `@/*` alias (defined in `tsconfig.json`):

```typescript
import { parseRecipe } from "@/lib/recipe-parser";
import type { Recipe } from "@/lib/recipe-types";
import SiteHeader from "@/components/SiteHeader";
```

### Validation Philosophy

- **Blocking for required fields**: Missing required fields (`id`, `title`, `ingredients`, `instructions`) block commits (exit code 1)
- **Informational for quality**: Quality checks (formatting, recommendations) remain informational (exit code 0)
- **Categorized**: Issues tagged as `schema`, `content`, or `file`
- **Severity levels**: `error`, `warning`, `info` (errors can be blocking or non-blocking)
- **Auto-runs**: Husky pre-commit hook runs validation and blocks commits on required field violations

### Static Generation

All recipe pages are statically generated at build time:

- `generateStaticParams()` in `app/recipes/[slug]/page.tsx` generates paths
- Images referenced in frontmatter must exist in `/public/images/`
- Build output shows count of generated pages

## Adding a New Recipe

1. Create `data/recipes/recipe-slug.md` with frontmatter + markdown body
2. Add recipe image to `/public/images/recipe-slug.jpg` (if applicable)
3. Run `npm run validate` to check for issues
4. Commit (validation runs automatically via pre-commit hook)

## Important Notes

- **Sentence case**: ALWAYS use sentence case for titles and section headers, not title case
  - ✅ `title: Chicken biryani` (not `Chicken Biryani`)
  - ✅ `### For the marinade:` (not `### For the Marinade:`)
  - Keep proper nouns capitalized: `Thai dumpling soup`, `Amma's chicken curry`
- **Image paths**: Must be in `/public/images/` (Next.js requirement for Vercel)
- **Template available**: Use `data/recipes/template.md` as starting point
- **No generic names**: Directories use recipe-specific names (`recipe-parser`, not `utils`)
- **Module size**: Each parser/validator module kept under 150 lines for maintainability
- **Type safety**: All recipe data flows through typed interfaces in `lib/recipe-types`
