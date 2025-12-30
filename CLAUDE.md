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

- **`lib/recipe-parser/`** - Parses markdown recipes into structured data (frontmatter, ingredients, instructions)
- **`lib/recipe-validator/`** - Validates recipe quality and schema (required fields, formatting, file conventions)
- **`lib/recipe-search/`** - Filters recipes by search query, tag, and contributor
- **`lib/contributors/`** - Loads contributor data from `data/contributors.json`
- **`lib/recipe-types/`** - Shared TypeScript interfaces for recipes, ingredients, instructions, contributors

### Recipe Markdown Format

Recipes use YAML frontmatter + markdown body:

```markdown
---
id: recipe-slug
title: Recipe title  # IMPORTANT: Use sentence case, not title case
subtitle: Short description
tags: [tag1, tag2]
image: filename.jpg
contributor: contributor-id  # Optional: references contributor from contributors.json
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

### Pages & Features

- **Home** (`/`) - Shows 3 most recent recipes
- **All Recipes** (`/recipes`) - Searchable/filterable recipe list with URL state sync
- **Recipe Detail** (`/recipes/[slug]`) - Individual recipe with Focus Mode toggle
- **Contributors** (`/contributors`) - Contributor profiles that filter recipes when clicked
- **About** (`/about`) - Static markdown content page

### Key Features

**Focus Mode** - Recipe pages have a distraction-free mode with:
- Checkboxes for ingredients and instructions (localStorage persistence)
- Side-by-side layout on desktop, stacked on mobile
- Hides image, story, tags, dates

**Search & Filtering** - Multi-criteria filtering with URL persistence:
- Search by recipe title/tags, filter by tag or contributor
- Supports combining multiple filters (AND logic)

**Theme System** - Light/dark mode with:
- localStorage persistence and system preference detection
- CSS variables for all colors (cream tones, burnt orange, sage green)

**Shared Styles** - Card components (RecipeCard, ContributorCard) use shared constants in `card-styles.ts` for consistency

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
- **Shared styles**: When adding new card-like components, use `card-styles.ts` constants to maintain consistency
