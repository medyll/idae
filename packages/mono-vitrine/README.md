# monorepo-vitrine

A CLI that creates individual GitHub "showcase" repositories from packages in any monorepo (pnpm, yarn or npm workspaces). Each showcase repo mirrors the package README and selected files (CHANGELOG, LICENSE, etc.), making packages discoverable without exposing the full monorepo.

## Features

- Works with pnpm (`pnpm-workspace.yaml`), yarn and npm (`workspaces` in `package.json`)
- Creates or updates a dedicated GitHub repository per package
- Syncs `README.md`, `CHANGELOG.md`, `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`
- Adds a banner linking back to the source monorepo
- Supports dry-run mode, orphan cleanup, and CI environments

## Installation

Install at the root of your monorepo:

```bash
pnpm add -Dw @medyll/monorepo-vitrine
# or
yarn add -D @medyll/monorepo-vitrine
# or
npm install -D @medyll/monorepo-vitrine
```

## Quick start

Run the CLI from the root of your monorepo:

```bash
# Preview what would happen (no changes pushed)
monorepo-vitrine --dry-run --verbose
```

## Usage

```bash
monorepo-vitrine [options]
```

### Options

| Flag | Description |
|------|-------------|
| `-d, --dry-run` | Simulate changes without pushing to GitHub |
| `-p, --allow-private` | Include packages marked as `private` in their `package.json` |
| `-c, --cleanup` | Delete showcase repos that no longer match a workspace package |
| `-v, --verbose` | Print detailed logs and full error stacks |
| `-s, --suffix [value]` | Append a suffix to repo names. Without value: uses `showcase`. Omitted: no suffix |

### Examples

```bash
# Dry-run with verbose output
monorepo-vitrine --dry-run --verbose

# Create showcase repos with default suffix (-showcase)
monorepo-vitrine --suffix

# Create showcase repos with a custom suffix
monorepo-vitrine --suffix=examples

# Include private packages and clean up orphans
monorepo-vitrine --allow-private --cleanup
```

## Authentication

Set `GITHUB_TOKEN` in your environment with a token that has `repo` permissions on the target GitHub account.

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

## CI Integration

The CLI detects CI environments automatically. When `GITHUB_ACTIONS` is set, it uses token-based HTTPS remotes instead of SSH.

The recommended approach is to add a job to an existing workflow (release, publish, or push on main):

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]
  workflow_dispatch: # allows manual trigger

jobs:
  publish:
    # ... your existing publish job

  showcase:
    needs: publish
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx @medyll/monorepo-vitrine --suffix
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## How it works

Repository names are derived from the package name (scope removed). For example, `@medyll/idae-socket` becomes `idae-socket`, or `idae-socket-showcase` with `--suffix`.

## License

MIT

**Author:** Lebrun Meddy ([@medyll](https://github.com/medyll))
