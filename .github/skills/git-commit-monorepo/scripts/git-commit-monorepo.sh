#!/usr/bin/env bash
# git-commit-monorepo.sh
# Secure commit for monorepo: strict message validation and package name extraction

set -e

# 1. Extract package name (format repo/packagename, without @)
if [ ! -f package.json ]; then
  echo "Error: No package.json found in the current directory." >&2
  exit 1
fi

# Extract the 'name' field
PKG_NAME=$(grep '"name"' package.json | head -1 | sed -E 's/.*"name"\s*:\s*"([^"]+)".*/\1/')
if [[ "$PKG_NAME" =~ ^@ ]]; then
  PKG_NAME=${PKG_NAME#@} # remove @
fi

# Check for /
if [[ ! "$PKG_NAME" =~ ^[a-zA-Z0-9]+\/[a-zA-Z0-9._-]+$ ]]; then
  echo "Error: Package name must be in the form repo/packagename (found: $PKG_NAME)" >&2
  exit 1
fi

# 2. Read commit message (argument or prompt)
if [ -n "$1" ]; then
  COMMIT_MSG="$1"
else
  read -rp "Commit message: " COMMIT_MSG
fi

# 3. Strict message validation (allowed type and exact scope)
REGEX="^(fix|feat|chore|docs|style|refactor|perf|test|build|ci|revert)\($PKG_NAME\):.+$"
if ! [[ "$COMMIT_MSG" =~ $REGEX ]]; then
  echo "Error: Message must be in the format <type>($PKG_NAME):message" >&2
  exit 1
fi

# 4. Add and commit (only in current directory)
git add .
git commit -m "$COMMIT_MSG"

echo "✅ Commit done for $PKG_NAME : $COMMIT_MSG"
