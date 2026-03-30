---
name: idae-csss
description: Use this for CSS utilities, design tokens, and dynamic class generation in the Idae ecosystem. Always use this instead of hardcoding colors, spacing, or class strings in Idae projects.
---

## Overview
CSS and style utilities for the Idae ecosystem. Provides design tokens, dynamic class generation, and utility helpers for consistent styling.

## Install
```bash
pnpm add @medyll/idae-csss
```

## Core API
- `css(classes)` — Conditionally compose class strings (like clsx)
- `token(name)` — Resolve a design token to its CSS variable value
- Utility class helpers: `spacing(size)`, `color(name)`, `fontSize(scale)`

## Usage
```ts
import { css, token } from '@medyll/idae-csss';

const classes = css({
  'btn': true,
  'btn-primary': isPrimary,
  'btn-disabled': isDisabled,
});
// → 'btn btn-primary'

const primary = token('color.primary'); // → 'var(--color-primary)'
```

```svelte
<div class={css(['card', { 'card-active': isActive }])}>
  <p style:color={token('color.text')}>Hello</p>
</div>
```

## Key concepts
- `css()` accepts strings, arrays, and objects (condition map)
- `token()` returns a CSS variable reference, not a raw value
- Design tokens follow `category.name` naming: `color.primary`, `space.md`
- Pairs with `@medyll/idae-htmlu` for className-based tag transforms
- Works in both JS/TS and Svelte template contexts
