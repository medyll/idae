# Changelog

## [1.0.5] - 2026-07-29
**Features:**
- add Playwright screenshot scripts and stubs for server-only packages
- enhance slider functionality and improve touch event handling
- add author information to README files and create collection context
- migrate sync-vitrine to package; add CLI, tests, and README; improve error logging and repo-name generation
- add keywords to package.json files for improved discoverability
- update @medyll/idae-config-prettier dependency to latest version across all packages
- add @medyll/idae-config-prettier package with initial configuration and update dependencies across the repository
- update publishConfig in package.json files to include directory for public access
- add comprehensive documentation and instructions for various skills and tools in the idae-dom-events package
- ajouter des fichiers de configuration et des composants de base pour le projet SvelteKit
- updated ci
- Add package-pre script for pre-processing packages

**Bug Fixes:**
- let indexIfy skip hand-maintained barrels
- ensure deterministic ordering of fileInfoList in MakeLibIndex
- update repository URLs in package.json files to use git+ protocol
- update @medyll/idae-prettier-config dependency to use latest version in multiple package.json files and pnpm-lock.yaml
- update @medyll/idae-prettier-config dependency to use workspace wildcard in multiple package.json files
- update @medyll/idae-prettier-config dependency to use version wildcard in multiple package.json files
- update @medyll/idae-prettier-config dependency to use workspace protocol in multiple packages
- update @medyll/idae-prettier-config dependency in multiple packages and pnpm-lock.yaml
- prevent duplicate exports in MakeLibIndex by refining export key generation
- prevent duplicate exports and improve export statement formatting in MakeLibIndex
- mettre à jour les dépendances vers les dernières versions
- css loading and breakpoints

**Refactoring:**
- update package READMEs for clarity and consistency
- update package dependencies and remove obsolete files
- main config changes

**Chores:**
- remove idae-mongo package and its related files
- ensure repository/scope/author/publishConfig in package.json (verified)
- add initial changelog for shared package with recent updates and fixes
- update package versions to latest across multiple packages
- update package versions across multiple packages to latest
- update package versions in eslint, prettier, and shared configurations
- update package versions and scopes in package.json files
- update package.json files to use workspace:* for Medyll dependencies
- update @medyll/idae-prettier-config to version ^1.2.1 across multiple packages
- versions updates
- package update
- chore
- main changes
- Update import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be
- Update npm dependencies and add Svelte v5.0.0-next.218
- Update npm dependencies and add new packages
- chore
- update npm dependencies
- Update npm dependencies and import paths
- Update package.json and add release script for idae-slotui
- Update package name to "@medyll/idae-shared"
- Update package-lock.json and dependencies configuration
- Update package.json with correct scope value
- clean up obsolete tools and configurations
- clean up obsolete tools and configurations
- Update package.json files to include scope for @medyll packages
- Update package.json files to include scope for @medyll packages
- deps
- chore
- prettier is now global
- removed shared dataops class
- created dataOp

**CI/CD:**
- reject write on unchanged index
- Update auto exports of entry components in multiple packages
- Update auto exports of entry components in multiple packages
- Update npm dependencies and reexport entry components
- Update ignore patterns in MakeLibIndex class
- Remove unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket
- update MakeLibIndex to use options for ignore patterns and lib root
- Update package.json with correct scope value
- clean up obsolete tools and configurations
- clean up obsolete tools and configurations
- chore

**Other:**
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- Refactor code structure for improved readability and maintainability
- Refactor: styles in Marquee, ToggleBar, and Tree components to use Tailwind CSS imports; update package scripts to use "prepackage" instead of "package:pre" in multiple package.json files; enhance index exports in idae-socket.
- Refactor code structure and remove redundant code blocks for improved readability and maintainability



## [Unreleased] - 2026-02-08
- **2026-01-28** - fix: prevent duplicate exports in MakeLibIndex by refining export key generation
- **2026-01-28** - fix: prevent duplicate exports and improve export statement formatting in MakeLibIndex
- **2025-02-08** - chore: chore
- **2024-09-22** - chore: main changes
- **2024-08-15** - fix(idae-slotui): css loading and breakpoints
- **2024-08-14** - ci(main):  reject write on unchanged index
- **2024-08-14** - ci(main): Update auto exports of entry components in multiple packages
- **2024-08-14** - Merge branch 'main' into dev
- **2024-08-14** - ci(main): Update auto exports of entry components in multiple packages
- **2024-08-13** - ci: Update npm dependencies and reexport entry components
- **2024-08-13** - ci(main): Update ignore patterns in MakeLibIndex class
- **2024-08-13** - chore: Update import paths in idae-stator, idae-engine, idae-socket, idae-data-tpl, idae-dom-events, idae-query, idae-mongo, idae-idbql, and idae-be
- **2024-08-13** - ci: Remove unused exports in idae-stator, idae-engine, idae-dom-events, idae-api, idae-query, idae-idbql, and idae-socket
- **2024-08-13** - feat(main): updated ci
- **2024-08-12** - chore(main): chore
- **2024-08-12** - feat(main): Add package-pre script for pre-processing packages
- **2024-08-12** - ci(main): update MakeLibIndex to use options for ignore patterns and lib root
- **2024-07-26** - chore(main): Update package.json and add release script for idae-slotui
- **2024-07-17** - chore(main): deps
- **2024-07-12** - refactor(config): main config changes
- **2024-07-12** - chore(config): removed shared dataops class
- **2024-07-12** - chore(shared): created dataOp
- **2024-07-11** - ci: chore
