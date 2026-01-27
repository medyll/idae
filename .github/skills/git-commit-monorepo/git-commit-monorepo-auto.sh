#!/bin/bash
# git-commit-monorepo-auto.sh
# List all changed packages in a monorepo (Idae style)
# Usage: bash git-commit-monorepo-auto.sh
#
# This script scans for modified files in each package (under packages/),
# and outputs a list of changed packages and their relative paths.
# No staging or commit is performed.
# Output format: <package-name> <relative-path>

set -e

# Find the root directory of the git repository
ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

# Find all changed files (staged or unstaged) under packages/
CHANGED_FILES=$(git status --porcelain | awk '{print $2}' | grep '^packages/' || true)

if [ -z "$CHANGED_FILES" ]; then
  exit 0
fi

# Extract unique package directories (e.g., packages/idae-db)
PACKAGE_DIRS=$(echo "$CHANGED_FILES" | awk -F/ '{print $1"/"$2}' | sort | uniq)

for package_dir in $PACKAGE_DIRS; do
  # Extract package name from package.json if available, else use directory name
  PKG_NAME="$package_dir"
  if [ -f "$package_dir/package.json" ]; then
    PKG_NAME=$(jq -r .name "$package_dir/package.json" | sed 's/^@//;s/\//-/g')
  else
    PKG_NAME=$(basename "$package_dir")
  fi
  echo "$PKG_NAME $package_dir"
done
#!/bin/bash

# git-commit-monorepo-auto.sh
# Auto-commit changes per package in a monorepo (Idae style)
# Usage: bash git-commit-monorepo-auto.sh
#
# This script scans for modified files in each package (under packages/),
# stages and commits them separately, enforcing one commit per package.
#
# Commit messages follow the strict conventional commit format:
#   <type>(<package>): <description>
#
# Only files within each package are committed. No cross-package commits.
#
# Requirements: jq (for reading package.json)

set -e

# Find the root directory of the git repository
ROOT_DIR="$(git rev-parse --show-toplevel)"
cd "$ROOT_DIR"

# Find all changed files (staged or unstaged) under packages/
CHANGED_FILES=$(git status --porcelain | awk '{print $2}' | grep '^packages/' || true)

if [ -z "$CHANGED_FILES" ]; then
  echo "No changes detected in packages/"
  exit 0
fi

# Extract unique package directories (e.g., packages/idae-db)
PACKAGE_DIRS=$(echo "$CHANGED_FILES" | awk -F/ '{print $1"/"$2}' | sort | uniq)

for package_dir in $PACKAGE_DIRS; do
  (
    cd "$package_dir"
    # Check for changed files in this package
    PKG_CHANGED=$(git status --porcelain | awk '{print $2}' | grep -v '^$')
    if [ -z "$PKG_CHANGED" ]; then
      exit 0
    fi

    # Stage all changes in the package
    git add .

    # Extract package name for commit scope (removes @, replaces / with -)
    if [ -f package.json ]; then
      PKG_NAME=$(jq -r .name package.json | sed 's/^@//;s/\//-/g')
    else
      PKG_NAME=$(basename "$package_dir")
    fi

    # Generate a default commit message (customize as needed)
    MSG_TYPE="fix"
    MSG_DESC="update in $PKG_NAME"
    COMMIT_MSG="$MSG_TYPE($PKG_NAME): $MSG_DESC"

    # Show the diff for review
    echo "\n--- Diff for $package_dir ---"
    git diff --cached
    echo "Commit message: $COMMIT_MSG"
    read -p "Commit this package? [y/N] " yn
    if [[ "$yn" =~ ^[Yy]$ ]]; then
      git commit -m "$COMMIT_MSG"
      echo "Committed $package_dir"
    else
      git reset
      echo "Skipped $package_dir"
    fi
  )
done

echo "Done. Uncommitted changes remain for skipped packages."