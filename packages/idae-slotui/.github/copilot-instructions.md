# GitHub Copilot Instructions for @medyll/idae-slotui-svelte

This repository contains the `@medyll/idae-slotui-svelte` package, a Svelte 5 component library within the Idae monorepo.

## Project Overview
- **Type:** Svelte 5 Component Library
- **Framework:** SvelteKit (used for development, documentation, and packaging)
- **Build Tool:** Vite
- **Language:** TypeScript / JavaScript
- **Styling:** SCSS (custom compilation), UnoCSS, `@medyll/cssfabric`

## Architecture & Key Patterns

### Component Structure
- **Location:** Components are organized in `src/lib/base` (basic UI elements) and `src/lib/controls` (form controls, interactive elements).
- **Svelte 5 Runes:** This project strictly uses Svelte 5 runes (`$props`, `$state`, `$derived`, `$bindable`, `$effect`).
  - **Props:** Define props using `$props()` with destructuring.
  - **State:** Use `$state()` for reactivity.
  - **Derived:** Use `$derived()` for computed values.
- **Slot Management:**
  - Use the `Slotted` component (`$lib/utils/slotted/Slotted.svelte`) to handle slots. This allows for conditional rendering and fallback content for slots.
  - Example:
    ```svelte
    <Slotted child={children}>{value ?? ''}</Slotted>
    ```
- **Styling Pattern:**
  - Components use SCSS files located alongside the `.svelte` file.
  - Styles are imported using a global scope but often scoped manually or via the build process:
    ```svelte
    <style global lang="scss">
        @use './button.scss';
    </style>
    ```
  - **CSS Generation:** A custom script (`scripts/release-css.js`) compiles these SCSS files into `src/lib/slotui-css/` which are then exported in `src/lib/index.ts`.

### Directory Structure
- `src/lib/`: Source code for the library.
  - `base/`: Atomic components (Icon, Badge, etc.).
  - `controls/`: Interactive components (Button, TextField, etc.).
  - `csss/`: Dynamic CSS generation logic.
  - `slotui-css/`: Generated CSS files (do not edit manually).
  - `utils/`: Utility functions and helpers (e.g., `Slotted`).
- `src/routes/`: Documentation and demo application (SvelteKit routes).
- `scripts/`: Build and maintenance scripts (CSS compilation, package prep).

## Developer Workflows

### Commands
- **Development:** `npm run dev` (Starts Vite dev server)
- **Build:** `npm run build` (Builds and packages the library)
- **Package:** `npm run package` (Runs `svelte-package`)
- **Test:** `npm run test` (Runs both integration and unit tests)
  - **Unit:** `npm run test:unit` (Vitest)
  - **Integration:** `npm run test:integration` (Playwright)
- **CSS Generation:** `npm run release-css` (Compiles SCSS to CSS)

### Creating a New Component
1.  Create a folder in `src/lib/base` or `src/lib/controls`.
2.  Create `ComponentName.svelte` using Svelte 5 syntax.
3.  Create `component-name.scss` for styles.
4.  Import styles in the component using `<style global lang="scss"> @use './component-name.scss'; </style>`.
5.  Export the component in `src/lib/index.ts` (or ensure the build script handles it).

## Coding Conventions
- **Props:** Use `interface` or `type` for Props definitions, typically exported from a `types.ts` file in the component folder or inline if simple.
- **Icons:** Use the `Icon` component (`$lib/base/icon/Icon.svelte`) which wraps Iconify.
- **Aliases:** Use configured aliases:
  - `$lib`: `src/lib`
  - `$components`: `src/components`
  - `$utils`: `src/utils`
  - `$styles`: `src/styles`

## External Dependencies
- **@medyll/idae-engine**: Core engine utilities.
- **@medyll/cssfabric**: CSS framework/library.
- **UnoCSS**: Utility-first CSS.
