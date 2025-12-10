# GitHub Copilot Instructions for Idae Monorepo

This repository is a monorepo managed with Lerna and NPM Workspaces, containing core components for Idae applications (Web, Mobile, Desktop).

## 🏗️ Architecture & Project Structure

- **Monorepo Root**: Managed via `lerna.json` and `package.json` (workspaces).
- **Packages (`packages/`)**:
  - **`idae-api-nest`**: Backend service built with **NestJS**.
  - **`idae-slotui`**: UI Component library built with **Svelte 5**.
  - **`idae-be`**: DOM manipulation library (callback-based).
  - **`idae-db`, `idae-mongo`, `idae-idbql`**: Database abstraction and query layers.
  - **`idae-engine`, `idae-utils`**: Core utility libraries.
- **Shared Configs (`packages-config/`)**: ESLint and Prettier configurations.

## 🛠️ Tech Stack & Conventions

### General
- **Language**: TypeScript (strict mode preferred).
- **Package Manager**: NPM Workspaces.
- **Versioning**: Changesets (`scripts/generate-changeset.js`).

### Svelte Projects (Most packages)
- **Framework**: **Svelte 5** (Strictly use Runes: `$state`, `$props`, `$derived`, `$effect`).
- **Build Tool**: Vite (`vite.config.ts`) + SvelteKit packaging (`svelte-package`).
- **Testing**: **Vitest** (`npm run test:unit`).
- **Styling**: SCSS, UnoCSS, `@medyll/cssfabric`.

### NestJS Project (`idae-api-nest`)
- **Framework**: NestJS (Modules, Controllers, Providers).
- **Testing**: **Jest** (`npm run test`, `npm run test:e2e`).
- **Database**: Mongoose (via `@nestjs/mongoose`).

## 🚀 Developer Workflows

### Build & Package
- **Root Build**: `npm run package-all` (Builds all packages).
- **Package Build**: `npm run build` (inside a package directory).
- **Package Generation**: `npm run package` (uses `svelte-package` for libraries).

### Testing
- **Unit Tests**: `npm run test:unit` (Vitest) or `npm run test` (Jest for NestJS).
- **Integration**: `npm run test:integration` (Playwright - where configured).

### Linting & Formatting
- **Lint**: `npm run lint` (ESLint).
- **Format**: `npm run format` (Prettier).

## 🧩 Specific Package Patterns

### `idae-slotui` (UI Library)
- **Component Structure**: `src/lib/base` (atoms) & `src/lib/controls` (molecules).
- **Slot Management**: Use `Slotted` component (`$lib/utils/slotted/Slotted.svelte`) for advanced slot handling.
- **Styling**: Co-located SCSS files imported via `<style global lang="scss"> @use './comp.scss'; </style>`.
- **Props**: Define using `$props()` interface destructuring.

### `idae-be` (DOM Library)
- **Pattern**: Callback-based DOM manipulation.
- **Focus**: Precise element targeting, event handling, and style management without heavy framework overhead.

## ⚠️ Critical Guidelines for AI Agents
1.  **Svelte 5 Only**: Do NOT generate Svelte 4 code (no `export let`, no `$:`, no `createEventDispatcher`). Use Runes.
2.  **Monorepo Awareness**: When importing between packages, check `package.json` dependencies. Use workspace protocols if applicable.
3.  **Config Files**: Respect `svelte.config.js`, `vite.config.ts`, and `nest-cli.json` settings.
4.  **Path Aliases**: Use `$lib`, `$components`, `$utils` as defined in `tsconfig.json` paths.
