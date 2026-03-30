---
name: idae-htmlu
description: Use this as a Vite preprocessor plugin to enable className-based HTML tag transforms. Add to vite.config.ts — it runs at build time with zero runtime cost.
---

## Overview
Vite preprocessor plugin for className-based HTML tag transforms. Processes HTML/Svelte templates at build time to apply tag-level class transformations.

## Install
```bash
pnpm add @medyll/idae-htmlu
```

## Core API
- `idaeHtmlu()` — Vite plugin; add to `plugins` array in vite.config.ts

## Usage
```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { idaeHtmlu } from '@medyll/idae-htmlu';

export default defineConfig({
  plugins: [idaeHtmlu()],
});
```

```html
<!-- Input: className-based tag transform -->
<div.card.active>Content</div.card.active>

<!-- Output after transform -->
<div class="card active">Content</div>
```

## Key concepts
- Runs at build/preprocess time — zero runtime overhead
- Transforms `.`-notation on tags into `class` attributes
- Works with Svelte, HTML, and any template files Vite processes
- No configuration required beyond adding the plugin
- Combine with `@medyll/idae-csss` for full design token support
