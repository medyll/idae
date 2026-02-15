# idae-mono-expand-vitrine

A small CLI that extracts package README and selected files from this pnpm monorepo
and publishes them into separate GitHub repositories used as lightweight "showcases".

This package contains the `sync-vitrine.js` CLI which:
- discovers workspace packages from `pnpm-workspace.yaml`
- prepares a temporary folder containing `README.md` (+ optional files like `CHANGELOG.md`, `LICENSE`)
- creates or updates a GitHub repository for each package (optionally)

Quick start
1. Install workspace dependencies from the repository root:

```bash
pnpm install
```

2. Run the CLI in dry-run mode to preview actions (no changes pushed):

```bash
node packages/idae-mono-expand-vitrine/bin/sync-vitrine.js --dry-run --verbose
```

Usage

- `--dry-run` : shows what would be done without pushing to GitHub.
- `--allow-private` : include packages marked as `private` in their package.json.
- `--cleanup` : delete showcase repositories that are no longer present in the monorepo.
- `--verbose` : print detailed logs and full error stacks.
- `--suffix [value]` : append a suffix to created repository names. If passed without a value, the default suffix `showcase` is used. If omitted, no suffix is appended.

Examples

- Dry-run, verbose:

```bash
node packages/idae-mono-expand-vitrine/bin/sync-vitrine.js --dry-run --verbose
```

- Create showcase repos with default suffix (`-showcase`):

```bash
node packages/idae-mono-expand-vitrine/bin/sync-vitrine.js --suffix
```

- Create showcase repos with a custom suffix:

```bash
node packages/idae-mono-expand-vitrine/bin/sync-vitrine.js --suffix=examples
```

Authentication

Set `GITHUB_TOKEN` in your environment with a token that has permissions to create and push to repositories on the target GitHub account.

Notes

- The script prefers SSH remotes when not running in CI. In CI (when `GITHUB_ACTIONS` is set) it uses token-based HTTPS remotes.
- By default repository names are built from the package name (scope removed). For example `@medyll/idae-socket` becomes `idae-socket` and with `--suffix` it becomes `idae-socket-showcase`.

License

MIT
