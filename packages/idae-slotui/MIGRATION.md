# MIGRATION.md

This document records all steps, questions, technical choices, and points of attention during the migration of the project to Svelte 5 and the integration of the shadcn-svelte design system.

## Table of Contents
- [Context](#context)
- [Migration Steps](#migration-steps)
- [Questions and Decisions](#questions-and-decisions)
- [Issues Encountered](#issues-encountered)
- [Useful Resources](#useful-resources)

 

## Context
  	- The current project uses Svelte 5, SCSS with mixins, and a custom theme.
	- Components are located in: `src/lib/base`, `src/lib/controls`, `src/lib/data`, `src/lib/navigation`, and `src/lib/ui`.
	- All component types must be properly declared at the top of each component file, inside a `<script module lang="ts">` block, except for "// snippet components".
	- Each component must start with an HTML comment `@component` describing its purpose.
	- All types must be declared in block form, with clear English comments for each property.
	- Migration of the project to Svelte 5 (runes, new API, etc.)
	- Adoption of the shadcn-svelte design system for UI components


## Migration Tracking, important

The migration tracking table for the migration steps  and their status will be maintained in the file: [MIGRATION_STATUS](MIGRATION_STATUS.md).
The migration tracking table for the  for all components and their status will be maintained in the file: [MIGRATION_COMPONENTS](MIGRATION_COMPONENTS.md).

## Migration Steps
   - [ ✅ Done ] Audit of existing code (components, styles, dependencies)
   - [✅ Done  ] Migration of components to Svelte 5 (runes, $props, $state, etc.)
   - [✅ Done  ] Migration from SCSS to CSS (where applicable)
	   - For each SCSS file, create a new .css file with the same base name in the same directory.
	   - Do not delete the original .scss files during migration; both formats should coexist until the migration is fully validated.
	   - Note: You will likely encounter errors and incompatibilities when converting from SCSS to PostCSS. Document any issues and solutions in the Issues Encountered section.
	- **Important:** Update all `<style global lang="scss"> @use 'file.scss'; </style>` blocks to `<style global> @import 'file.css'; </style>` in Svelte components as part of the migration to Tailwind and CSS. Always use `@import` for .css files.
	- [ ] Install Tailwind CSS v4 as a priority before any other migration steps.
	- [ ] Create and configure the theme (theme.css) for Tailwind v4.
		- Collect all theme indices and variables found in SCSS mixins and shared SCSS files, and migrate them to theme.css.
	- [ ] Change export mode for .svelte modules: automate index.ts creation for each component directory (see below)
	- [ ] Integration and configuration of shadcn-svelte
	- [ ] Progressive replacement of native components by those from the design system
	- [ ] Style and theme adjustments
	- [ ] Testing and validation
	- [ ] After each implementation step, review the relevant guidelines (Svelte 5, shadcn-svelte, Tailwind v4, etc.) to ensure compliance and best practices.

## Migration steps tracking

1. Audit of existing code (components, styles, dependencies)
2. Migration of components to Svelte 5 (runes, $props, $state, etc.)
3. Progressive replacement of native components by those from the design system
4. Migration SCSS → CSS (keep both formats until validation)
5. Installation and configuration of Tailwind CSS v4 (priority)
6. Creation and configuration of Tailwind v4 theme (theme.css)
7. Integration and configuration of shadcn-svelte
8. Style and theme adjustments
9. Testing and validation
10. Automated export index generation for Svelte components

### Automated Export Index Generation

To standardize and automate the export of Svelte components, a script should be created:

- **Script:** `scripts/make-export.ts`
- **Purpose:** Loops through all components and component directories in `src/lib/`.
- **For each component or component directory:**
	- Creates (or updates) an `index.ts` file in that directory.
	- The `index.ts` file must re-export all `.svelte` components in the directory.
	- Example content for a single component:
		```ts
		import Component from "./Component.svelte";
		export { Component };
		```
	- Example for multiple components:
		```ts
		import Component1 from "./Component1.svelte";
		import Component2 from "./Component2.svelte";
		export { Component1, Component2 };
	- Example for hierarchical components:
		```ts
		import AlertRoot from "./Alert.svelte";
		import AlertButtonClose from "./AlertButtonClose.svelte";
		import AlertButtonZone from "./AlertButtonZone.svelte";
		import AlertMessage from "./AlertMessage.svelte";
		import AlertTopButton from "./AlertTopButton.svelte";

		export const Alert = { Root: AlertRoot, ButtonClose: AlertButtonClose, ButtonZone: AlertButtonZone, Message: AlertMessage, TopButton: AlertTopButton };
		```

This ensures consistent and discoverable exports for all Svelte components. The script should be run after adding or renaming components.

## Questions and Decisions
	- To be completed throughout the migration

## Issues Encountered
	- To be completed throughout the migration

## Useful Resources
- [Svelte 5 documentation](https://svelte.dev/docs)
- [shadcn-svelte documentation](https://www.shadcn-svelte.com/docs/installation)
- [shadcn-svelte MCP server (guidelines & components)](https://shadcn-svelte.mastra.cloud/api/mcp/shadcn/sse)
- [shadcn-svelte Migration Guide](https://www.shadcn-svelte.com/docs/migration.md)
- [shadcn-svelte Svelte 5 Migration](https://shadcn-svelte.com/docs/migration/svelte-5)
- [shadcn-svelte Tailwind v4 Migration](https://shadcn-svelte.com/docs/migration/tailwind-v4)

## SCSS to CSS Migration

### Status: Completed

All SCSS files in the following directories have been successfully migrated to CSS:
Each corresponding Svelte component has been updated to reference the new CSS files.




---


### Snippet Migration Instructions (STRICT)

Purpose: standardize creation of small "snippet" components discovered inside parent components.

1) Scope and order
- Process directories in this exact sequence: `controls/`, `data/`, `navigation/`, `ui/`, `utils/`.

2) Discovery (identification)
- Find candidate snippet properties using the regex: `^[ \t]*(?!children).*\bSnippet\b.*;$` in component scripts.
- The migration script `scripts/migrate-snippet.js` can produce a preview list; run it locally to inspect results:

```powershell
node .\scripts\migrate-snippet.js
```

3) File placement rules (CRITICAL)
- Do NOT create a `snippets/` subdirectory.
- Do NOT move new components into a central directory.
- Each generated snippet component MUST be created in the same directory as its parent component. Example: if `Button.svelte` lives in `src/lib/controls/button/`, then `ButtonStart.svelte` must also be created in `src/lib/controls/button/`.

4) Naming conventions
- Use PascalCase for filenames and component names (example: `ButtonStart.svelte`).
- Name should be meaningful and, when helpful, prefixed by the parent component name.

5) Component template (mandatory)
- Every snippet file must include a `@component` HTML comment, use Svelte 5 runes for props. Keep implementations minimal.
- no <script module lang="ts"> in snippet component

Canonical template (replace types and names):

```svelte
<!-- @component snippet component ButtonStart — for Button -->
<script lang="ts">
	export type ButtonStartProps = any; // inherits from the snippet buttonStart declared in the module part of Button.svelte; ex: Snippet<[Record<string, any>]> => export type ButtonStartProps = Record<string, any>]>;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet buttonStart()}
	{@render children?.()}
{/snippet}

```

Notes about the template:
- Use `$props()` from Svelte 5 runes to destructure `children` and other props.
- Keep the snippet logic minimal — it should not contain unrelated implementation details.

6) Styling
- Import the component's CSS using `<style global> @import './Name.css'; </style>` as required by the migration rules.

7) Execution rules / workflow
- Work on one directory at a time. Finish generating and checking all snippet files for that directory before moving to the next.
- Do not change parent component file locations.
- Follow the exact template and naming rules — automated tools and downstream scripts rely on these conventions.

8) Validation
- After creating snippet files for a directory, run TypeScript checking and unit tests locally:

```powershell
pnpm run build
pnpm run test:unit
```

- If `scripts/migrate-snippet.js` supports a dry-run or preview mode, use it first to validate detection patterns.

9) Troubleshooting
- If the migration script errors: inspect its output, fix the offending component manually using the template, and re-run the checks.
- If a generated snippet requires additional props, add explicit typing in the `script module` block and keep the restProps spread for forwards.

10) Example: complete minimal generated file







### Snippet Components Correction Instructions (STRICT)

Purpose: standardize creation of small "snippet" components discovered inside parent components.

1) Scope and order
- Process directories in this exact sequence: `controls/`, `data/`, `navigation/`, `ui/`, `utils/`.
- a "snippet component" is a svelte component with the word "snippet component" in its content, referring to a parent component's snippet.


2) Discovery (identification) 
- The migration script `scripts/check-internal-typs.js` can produce a preview list; run it locally to inspect results:
```powershell
node .\scripts\check-internal-typs.js
```
- if the column Int. is ❌ , then there are chances this is a "snippet component" which need to be corrected.

3) File placement rules (CRITICAL)
- Do NOT create a `snippets/` subdirectory.
- Do NOT move new components into a central directory.
- Each generated snippet component MUST be created in the same directory as its parent component. Example: if `Button.svelte` lives in `src/lib/controls/button/`, then `ButtonStart.svelte` must also be created in `src/lib/controls/button/`.


5) Component template (mandatory)
- Every snippet file must include a `@component` HTML comment, use Svelte 5 runes for props. Keep implementations minimal.
- The component must not contain "<style />"

Canonical template (replace types and names) STRICT:

```svelte
<!-- @component snippet component ButtonStart — for Button -->
<script module lang="ts">
	export type ButtonStartProps = any; // inherits from the snippet buttonStart declared in the module part of Button.svelte; ex: buttonStart: Snippet<[Record<string, any>]> => export type ButtonStartProps = Record<string, any>]>;
</script>

<script lang="ts">
	const { children } = $props();
</script>

{#snippet buttonStart()}
	{@render children?.()}
{/snippet}

```

6) Verification (mandatory)
- run the list command th see if Int. is ✅ for the component.
```powershell
node .\scripts\check-internal-typs.js
```
 