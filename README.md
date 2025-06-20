# recipe-architect

A minimal, schema-driven recipe data project.

## Quick start

```bash
# Clone
git clone https://github.com/your-handle/recipe-architect.git
cd recipe-architect

# Install dependencies (Node ≥ 18 required)
npm install          # reads package.json + package-lock.json

# Run in localhost
npm run dev
```

## Folder Layout

```
data/
  units.json           # canonical units
  ingredients.json     # ingredient catalog
  recipes/             # one JSON per recipe
schema/                # JSON Schemas
scripts/validate.ts    # structural + cross-file checks
```

## Adding a new recipe

1. Extend ingredients.json (or reuse existing IDs).
2. Create data/recipes/<slug>.json.
3. `npm run validate` – must pass.
4. Commit.

## Pre-commit hook

Husky v9 runs validation automatically:

```bash
.husky/pre-commit
#!/usr/bin/env sh
npm run validate
```
