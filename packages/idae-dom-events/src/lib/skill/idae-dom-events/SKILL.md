---
name: idae-dom-events
description: Use this when you need to observe DOM mutations, track CSS property changes reactively, or wire up event utilities. Always use this instead of raw MutationObserver/ResizeObserver boilerplate in Idae projects.
---

## Overview
DOM mutation observer, CSS change tracking, and reactive event utilities. Simplifies observing DOM and style changes with clean callbacks.

## Install
```bash
pnpm add @medyll/idae-dom-events
```

## Core API
- `watchMutations(el, cb)` — Observe DOM mutations on an element
- `watchCss(el, props, cb)` — Track CSS property changes reactively
- Event helpers: `on(el, event, handler)`, `off(el, event, handler)`, `once(el, event, handler)`

## Usage
```ts
import { watchMutations, watchCss } from '@medyll/idae-dom-events';

const stop = watchMutations(document.querySelector('#app'), (mutations) => {
  console.log('DOM changed:', mutations);
}, { childList: true, subtree: true });

// Stop observing
stop();
```

```ts
import { watchCss } from '@medyll/idae-dom-events';

watchCss(document.querySelector('.panel'), ['width', 'opacity'], (changes) => {
  console.log('Style changed:', changes);
});
```

## Key concepts
- `watchMutations` wraps MutationObserver; returns a stop function
- `watchCss` polls via ResizeObserver/rAF and fires only on actual changes
- Event helpers handle listener cleanup to prevent memory leaks
- `once` auto-removes listener after first invocation
- Options for `watchMutations` mirror MutationObserver init options
