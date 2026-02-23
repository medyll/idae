# MIGRATION.md

This document records all steps, questions, technical choices, and points of attention during the migration of the project to Svelte 5 and the integration of the shadcn-svelte design system.

---

## Table of Contents
- [Context](#context)
- [Migration Steps](#migration-steps)
- [Questions and Decisions](#questions-and-decisions)
- [Issues Encountered](#issues-encountered)
- [Useful Resources](#useful-resources)

---

## Context
- The current project uses Svelte 5, SCSS with mixins, and a custom theme.
- Components are located in: `src/lib/base`, `src/lib/controls`, `src/lib/data`, `src/lib/navigation`, and `src/lib/ui`.
- All component types must be properly declared at the top of each component file, inside a `<script module lang="ts">` block.
- Each component must start with an HTML comment `@component` describing its purpose.
- All types must be declared in block form, with clear English comments for each property.
- Migration of the project to Svelte 5 (runes, new API, etc.)
- Adoption of the shadcn-svelte design system for UI components

## Migration Steps
- [ ] Audit of existing code (components, styles, dependencies)
- [ ] Migration of components to Svelte 5 (runes, $props, $state, etc.)
- [ ] Integration and configuration of shadcn-svelte
- [ ] Progressive replacement of native components by those from the design system
- [ ] Migration from SCSS to CSS (where applicable)
	- For each SCSS file, create a new .css file with the same base name in the same directory.
	- Do not delete the original .scss files during migration; both formats should coexist until the migration is fully validated.
- [ ] Style and theme adjustments
- [ ] Testing and validation

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

