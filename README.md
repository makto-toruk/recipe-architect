# recipe-architect

# tests

Running tests required me to install some tools first

Node.js

```bash
# 1. Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
exec $SHELL

# 2. Install the current LTS release
nvm install --lts
nvm use --lts            # sets it for this shell
nvm alias default lts/*  # optional: make it default for new shells

# 3. Verify
node -v   # e.g. v22.3.1
npm  -v   # e.g. 10.5.0

# 4. Install
# in my repo
npm init -y      # creates package.json with sensible defaults
npm install      # installs dev dependencies (typescript, ajv, husky, etc.)
npm run validate # runs the validation script we set up

# 5. Install tools
npm i -D typescript ts-node @types/node \
       ajv ajv-formats ajv-errors

```

I set up validation with husky

```bash
# 1 – install Husky locally
npm install -D husky

# 2 – initialise once (adds prepare script + default pre-commit)
npx husky init

# 3 – replace the generated pre-commit with your validator
echo '#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npm run validate
' > .husky/pre-commit
chmod +x .husky/pre-commit

# 4 – commit the hook
git add .husky/pre-commit package.json
git commit -m "chore: enforce JSON validation pre-commit"

```
