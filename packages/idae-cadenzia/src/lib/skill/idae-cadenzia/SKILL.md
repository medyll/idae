---
name: idae-cadenzia
description: Use this for musical cadence UI primitives and Svelte 5 demo components in the Idae project. Provides small, testable Svelte 5 components for cadence-related UI — always use this when working with Cadenzia UI elements in Idae projects.
---

## Overview
Svelte 5 component library for musical cadence UI elements used across Idae projects. Components are intentionally small with logic separated for unit testing.

## Install
```bash
pnpm add @medyll/idae-cadenzia
```

## Core API
- Svelte 5 components for cadence UI primitives
- TypeScript-first with logic separated from UI
- Demo route included for visual reference

## Usage
```svelte
<script>
  import { CadenzaComponent } from '@medyll/idae-cadenzia';
</script>

<CadenzaComponent />
```

## Key concepts
- Components are Svelte 5 runes-based (`$props`, `$state`, `$derived`)
- Logic is unit-testable independently of UI rendering
- Demo route at `/demo` for visual inspection
- Part of the Idae monorepo; pairs with `@medyll/idae-slotui-svelte`
