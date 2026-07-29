# Changelog

## [1.185.3] - 2026-07-29
**Features:**
- add Playwright screenshot scripts and stubs for server-only packages
- add add-skill CLI entry point for @medyll packages
- add 'add-skill' command to multiple packages and enhance skill management
- enhance slider functionality and improve touch event handling
- add author information to README files and create collection context
- update package names and improve documentation for idae-slotui, idae-socket, idae-stator, and idae-sync
- add context-mode hooks for vscode-copilot integration
- update exports in idae-socket and add idae-query to pnpm-lock.yaml
- migrate sync-vitrine to package; add CLI, tests, and README; improve error logging and repo-name generation
- add keywords to package.json files for improved discoverability
- update @medyll/idae-config-prettier dependency to latest version across all packages
- update README files with architecture diagrams for various packages and enhance global architecture in the generator script
- add @medyll/idae-config-prettier package with initial configuration and update dependencies across the repository
- update package dependencies to use @medyll/idae-shared and refactor import paths
- update publishConfig in package.json files to include directory for public access
- update package.json files to set private flag and adjust dependencies to use 'next' version
- update package dependencies to use workspace:* and add verification script for internal dependencies

**Bug Fixes:**
- update import statements for prettier configuration across multiple packages
- update import paths for prettier configuration across multiple packages
- update repository URLs in package.json files to use git+ protocol
- update @medyll/idae-prettier-config dependency to use latest version in multiple package.json files and pnpm-lock.yaml
- update @medyll/idae-prettier-config dependency to use workspace wildcard in multiple package.json files
- update @medyll/idae-prettier-config dependency to use version wildcard in multiple package.json files
- update @medyll/idae-prettier-config dependency to use workspace protocol in multiple packages
- update @medyll/idae-prettier-config dependency in multiple packages and pnpm-lock.yaml
- update package scopes from '@medyll' to 'medyll' for consistency
- packaging and workspace deps

**Documentation:**
- update SKILL.md for git-commit-monorepo skill

**Refactoring:**
- update package READMEs for clarity and consistency
- update import paths for MakeLibIndex in package-pre.js scripts

**Chores:**
- publish packages
- remove test script command from package.json
- add initial changelog for shared package with recent updates and fixes
- update package versions to latest across multiple packages
- update package versions across multiple packages to latest
- add author field to package.json files across multiple packages
- add repository field to package.json files across multiple packages
- update package.json files to use workspace:* for Medyll dependencies
- update @medyll/idae-prettier-config to version ^1.2.1 across multiple packages

**Other:**
- Refactor code structure for improved readability and maintainability
- Refactor context-mode hooks to include VS Code environment guard; remove unused QwenAdapter; add BOM restoration scripts and PowerShell utilities for branch management.
- Refactor code structure for improved readability and maintainability
- Refactor exports in index.ts for improved organization and clarity
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- Refactor: styles in Marquee, ToggleBar, and Tree components to use Tailwind CSS imports; update package scripts to use "prepackage" instead of "package:pre" in multiple package.json files; enhance index exports in idae-socket.
- Apply changeset versions
- Refactor code structure and remove redundant code blocks for improved readability and maintainability
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- reverted before merge catastrophe
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions
- Apply changeset versions



## [Unreleased] - 2026-02-08
- **2026-01-29** - refactor: update import paths for MakeLibIndex in package-pre.js scripts
- **2026-01-28** - feat: update package dependencies to use @medyll/idae-shared and refactor import paths
- **2026-01-27** - docs: update SKILL.md for git-commit-monorepo skill
- **2026-01-23** - Refactor code structure and remove redundant code blocks for improved readability and maintainability

## [medyll/idae-engine@1.118.0] - 2025-06-06
- **2025-03-24** - refactor(dataOp): rename dataList to data for consistency in grouping methods
- **2025-03-17** - test(idae-engine): add setup for test data in beforeEach hook
- **2025-03-17** - test(idae-engine): updated tests
- **2025-03-08** - feat(idae-model): ajouter des composants CRUD et types pour la gestion des collections
- **2024-08-14** - ci(main): Update auto exports of entry components in multiple packages
- **2024-08-14** - Merge branch 'main' into dev
- **2024-08-14** - ci(main): Update auto exports of entry components in multiple packages
- **2024-08-13** - ci: Update npm dependencies and reexport entry components
- **2024-08-13** - chore: Update import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be
- **2024-08-13** - ci: Remove unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket
- **2024-08-13** - ci(main): updated prettier config
- **2024-08-13** - feat(main): updated ci
- **2024-08-12** - chore(main): chore
- **2024-08-12** - feat(main): Add package-pre script for pre-processing packages
- **2024-07-25** - ci: clean up obsolete tools and configurations
- **2024-07-17** - chore(main): deps
- **2024-07-14** - chore(main): prettier is now global
- **2024-07-13** - chore (idae-engine): added getDataKeys to dataOp
- **2024-07-13** - chore(main): setup cleaning phase
- **2024-07-12** - chore(config): renammed packages
- **2024-07-12** - chore(idae-engine):
- **2024-07-12** - chore(main): peerDeps
