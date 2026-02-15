# Changelog

## [Unreleased] - 2026-02-08
- **2026-02-03** - feat: Update documentation and remove outdated skills for idae packages; add GitHub Copilot instructions for new packages
- **2026-02-02** - feat: implement count() method for document counting in CollectionCore and CollectionState
- **2026-01-29** - refactor: update import paths for MakeLibIndex in package-pre.js scripts
- **2026-01-28** - feat: update package dependencies to use @medyll/idae-shared and refactor import paths
- **2026-01-28** - chore: release v0.0.2
- **2026-01-28** - fix: reorder exports in index.ts to include config.js
- **2026-01-27** - docs: update SKILL.md for git-commit-monorepo skill
- **2026-01-24** - refactor: update package dependencies and remove obsolete files
- **2026-01-24** - refactor: remove processor and watcher classes, update CLI for README retrieval
- **2026-01-24** - feat: add skills to retrieve README.md for multiple packages via CLI
- **2026-01-24** - feat: add CLI scripts to retrieve README.md for multiple packages
- **2026-01-23** - Refactor styles to use SCSS instead of Tailwind CSS in various components; remove unused global styles and add new theme variables for SlotUI.
- **2026-01-23** - Refactor: styles in Marquee, ToggleBar, and Tree components to use Tailwind CSS imports; update package scripts to use "prepackage" instead of "package:pre" in multiple package.json files; enhance index exports in idae-socket.
- **2026-01-23** - Refactor code structure and remove redundant code blocks for improved readability and maintainability
- **2026-01-21** - refactor: Clean up code formatting and improve readability in idbstate and machine modules
- **2026-01-17** - feat: update auto exports in multiple index files to include new components and services
- **2026-01-17** - refactor(idae-idbql): improve CombineElements type definition and add typing for createIdbqDb
- **2026-01-15** - fix: update pnpm-lock.yaml to remove unnecessary dependency and add new workspace links
- **2026-01-14** - Refactor code structure for improved readability and maintainability
- **2026-01-12** - chore: update package versions and enhance test coverage for query and operators
- **2026-01-12** - fix: update delete event data structure in CollectionCore
- **2026-01-12** - fix: update demo page to improve database handling and reactivity
- **2026-01-12** - fix: correct form event handling in demo page
- **2026-01-12** - feat: refactor demo page to manage clients and notes; update data structures and UI
- **2026-01-12** - feat: add Svelte 5 agent documentation and refactor demo page for chat functionality
- **2026-01-12** - feat: implement demo page with user and message management; update example types
- **2026-01-12** - feat: enhance Svelte 5 reactivity documentation and add tests for user state updates
- **2026-01-12** - feat: add initial project documentation, backlog, and sprint structure; implement unit tests for core functionalities
- **2025-12-10** - feat: Add GitHub Copilot instructions and project guide for @medyll/idae-idbql
- **2025-06-06** - chore: indexes

## [medyll/idae-idbql@0.119.1] - 2025-06-06
- **2025-06-06** - chore: changeset

## [medyll/idae-idbql@0.119.0] - 2025-06-06
- **2025-06-06** - chore: changeset

## [medyll/idae-idbql@0.118.0] - 2025-06-06
- **2025-03-24** - fix(idae-slotui): restore export for collection.svelte.js in index.ts
- **2025-03-17** - feat(idae-main): update dependencies and improve exports in index.ts
- **2025-03-17** - refactor(idae-idbql): clean up code formatting and remove commented-out checks in idbql files
- **2025-03-11** - feat(idae-idbql): ajouter un fichier de configuration Prettier et améliorer l'importation des modules
- **2025-03-08** - feat(idae-model): ajouter des composants CRUD et types pour la gestion des collections
- **2025-03-07** - fix(idae-idbql): gérer correctement la suppression des éléments dans l'état des données
- **2025-03-03** - chore(idae-idbql): remove unnecessary $derived from results assignment
- **2025-03-03** - fix(idae-idbql): update return types of get and getAll methods to ResultSet<T>
- **2025-03-03** - fix(idae-idbql): cast update return type to unknown and handle undefined case
- **2025-03-03** - chore(idae-idbql): fixes
- **2025-03-03** - fix(idbqlEvent): removed object destruction in event main manager
- **2025-03-03** - fix(idbstate): corriger le type de retour de la méthode getAll pour retourner un tableau d'éléments
- **2025-03-02** - feat(idae-idbql): refactor collection methods to return promises and enhance type safety
- **2025-03-02** - feat: update put and add methods to return promises in StateCollectionDyn
- **2025-02-28** - feat: update collection imports and enhance state management in idbql
- **2024-08-19** - chore(idae-idbql): Update imports and typings in example.ts and +page.svelte files
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
- **2024-07-25** - chore: clean up obsolete tools and configurations
- **2024-07-17** - chore(main): deps
- **2024-07-14** - chore(main): prettier is now global
- **2024-07-12** - chore(config): packaging
- **2024-07-12** - chore(config): renammed packages
- **2024-07-12** - chore(shared): created dataOp
- **2024-07-11** - refactor:(data-idbql): replaced calls to query by @medyll/data-query
- **2024-07-11** - ci: chore
- **2024-07-11** - chore(idae-idbql): dependencies
- **2024-07-10** - refactor(idae-idbql): integrated to monorepo
