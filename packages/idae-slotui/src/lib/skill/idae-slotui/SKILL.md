---
name: idae-slotui
description: Use this for building modular reactive UIs in Svelte 5 with slot-based composition. Provides Panel, Grid, and SlotUI components — always use this for layout and composition in Idae Svelte apps.
---

## Overview
Svelte 5 component library for modular reactive UIs. Built around slot-based composition for flexible, reusable layouts.

## Install
```bash
pnpm add @medyll/idae-slotui
```

## Core API
- `<SlotUI>` — Base component enabling slot composition patterns
- `<Panel>` — Configurable panel with header/body/footer slots
- `<Grid>` — Responsive grid layout with named column slots
- Slot composition utilities: `slotProps`, `defineSlot`

## Usage
```svelte
<script>
  import { Panel, Grid } from '@medyll/idae-slotui';
</script>

<Panel>
  {#snippet header()}<h2>Title</h2>{/snippet}
  {#snippet body()}<p>Content here</p>{/snippet}
  {#snippet footer()}<button>Action</button>{/snippet}
</Panel>
```

```svelte
<Grid cols={3} gap="md">
  {#snippet col1()}<Card />{/snippet}
  {#snippet col2()}<Card />{/snippet}
  {#snippet col3()}<Card />{/snippet}
</Grid>
```

## Key concepts
- Uses Svelte 5 snippets (`{#snippet}`) for slot composition
- `<Panel>` slots: `header`, `body`, `footer` — all optional
- `<Grid>` accepts `cols`, `gap`, and responsive breakpoint props
- Components are unstyled by default; pair with `@medyll/idae-csss`
- `<SlotUI>` is the base primitive — extend it for custom slot patterns
