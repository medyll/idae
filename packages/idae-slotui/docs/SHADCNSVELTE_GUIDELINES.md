# Bits UI / Shadcn-Svelte Standard for Svelte 5

This document summarizes the implementation standard for building Svelte 5 components following Bits UI and shadcn-svelte patterns.

1. Components as Primitives
- Components must be headless by default, exposing logic and accessibility but not styling.
- Use Root/Element split (e.g., `Accordion.Root`, `Accordion.Trigger`).

2. Using Runes
- Use Svelte 5 runes (`$props()`, `$state()`, `$bindable()`, `$effect()`) for props and state.

3. Snippets over Slots
- Prefer `Snippets` for content injection and `child` snippet for delegation (replacement for `asChild`).

4. Prop Drilling & Attribute Spread
- Support `...rest` attribute spread on root elements and forward event handlers.

5. Composition over Configuration
- Encourage composition patterns rather than deep prop configuration.

6. Type Safety
- All components in TypeScript with strict prop interfaces and exported types.

7. Accessibility
- Implement WAI-ARIA roles and keyboard interactions by default.

8. SCSS and Styling
- Keep source SCSS in `src/styles` and import via global style tags.

9. Exports & Packaging
- Export public components via `src/lib/index.ts` and update with `scripts/make-export.js`.

10. Tests & Docs
- Include docs comments for `src/lib/docs/docs.js` extraction and keep `src/tests/docs.test.js` passing.

Notes: This file was added to integrate the shadcn-svelte standard into BMAD project metadata and guidance.

11. Registry compatibility (shadcn-style)
- Provide a `registry/registry.json` that lists copyable components and their file paths.
- For each public component, include a `public/r/<name>.json` metadata file (used by registry CLIs).
- Host `registry.json` at a public URL (set `bmad/config.yaml:registry.public_url`) so `npx shadcn add <url>/r/<component>` works.
- Components in the registry should be self-contained and rely only on explicit dependencies.
- Example registry structure:

```
registry/
	ui/
		button.svelte
		card.svelte
registry.json
public/
	r/
		button.json
```

12. Guidance for authors
- Keep components minimal and headless so consumers can copy & style.
- Document external deps in each component metadata file.
- Prefer explicit utilities (`cn()`, `cva`) and avoid internal deep imports.

