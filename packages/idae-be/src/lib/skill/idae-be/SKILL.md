---
name: idae-be
description: >
  Complete guide for @medyll/idae-be — a modern TypeScript DOM manipulation library.
  Use this skill whenever the user works with be(), DOM selection, event handling, CSS styles,
  HTML attributes, dataset manipulation, DOM traversal, HTTP content loading, timers, class toggling,
  position helpers, or element insertion/removal. Replaces jQuery and raw DOM APIs.
  Auto-triggers on: be(), addClass, removeClass, toggleClass, on(), off(), fire(), setStyle, getStyle,
  setAttr, getAttr, setData, getData, append, prepend, insert, update, remove, wrap, unwrap, find,
  findAll, up, next, previous, siblings, children, closest, timeout, interval, updateHttp, insertHttp,
  DOM manipulation, event delegation, idae-be, @medyll/idae-be, createBe, Fragments, eachNode.
---

## Overview

`@medyll/idae-be` is a lightweight, zero-dependency, chainable DOM manipulation library in TypeScript.
Inspired by jQuery but fully typed, modular and modern. Each concern (styles, events, DOM, walk…) lives
in its own handler module, all surfaced on the `Be` class via two equivalent APIs:

- **Direct shorthand methods**: `be('#el').addClass('active').on('click', fn)`
- **Handler object API**: `be('#el').classes({ add: 'active' }).events({ on: { click: fn } })`

## Install

```bash
pnpm add @medyll/idae-be
```

## Quick start

```ts
import { be } from '@medyll/idae-be';

// Select, mutate, chain
be('#btn').on('click', () => {
  be('#modal').addClass('is-open').setStyle('display', 'flex').setAttr('aria-hidden', 'false');
});

// Load remote HTML into an element
be('#content').updateHttp('/partials/dashboard.html');

// Walk the DOM and mutate results
be('#list').children('li').without('.disabled').addClass('selectable');

// Delayed action
be('#toast').addClass('show').timeout(() => {
  be('#toast').removeClass('show').fire('toast:hidden');
}, 3000);
```

## Module summary

| Module | Direct methods | Handler key |
|---|---|---|
| **Styles** | `setStyle` `getStyle` `unsetStyle` | `styles({set,get,unset})` |
| **Classes** | `addClass` `removeClass` `toggleClass` `replaceClass` | `classes({add,remove,toggle,replace})` |
| **Attributes** | `setAttr` `getAttr` `deleteAttr` | `attrs({set,get,delete})` |
| **Dataset** | `setData` `getData` `deleteData` `getKey` | `data({set,get,delete,getKey})` |
| **Events** | `on` `off` `fire` | `events({on,off,fire})` |
| **DOM** | `update` `append` `prepend` `insert` `remove` `replace` `wrap` `unwrap` `clear` `normalize` | `dom({...})` |
| **Text** | `updateText` `appendText` `prependText` `replaceText` `removeText` `clearText` `normalizeText` `wrapText` | `text({...})` |
| **Walk** | `up` `next` `previous` `siblings` `children` `closest` `find` `findAll` `firstChild` `lastChild` `without` | `walk({...})` |
| **HTTP** | `updateHttp` `insertHttp` | `http({update,insert})` |
| **Position** | `clonePosition` `overlapPosition` `snapTo` | `position({...})` |
| **Timers** | `timeout` `interval` `clearTimeout` `clearInterval` | `timers({...})` |

## Key concepts

- `be(selector)` accepts CSS selectors (string), `HTMLElement`, or `HTMLElement[]`
- All methods return the `Be` instance — always chainable
- Handler-object API (`styles({...})`, `dom({...})`) accepts multiple sub-operations in one call
- Callbacks in walk/dom/http handlers receive `{ be, fragment, root }` (`HandlerCallbackProps`)
- HTTP methods use `fetch` under the hood — CORS rules apply
- `createBe(tag)` creates a new detached element; `Fragments` provides cached `DocumentFragment` factories

## References

Read these files for complete documentation:

- **`references/api-reference.md`** — Full method signatures, parameter types, and return values for every module
- **`references/patterns.md`** — Real-world recipes: modals, accordions, lazy loading, form validation, infinite scroll
- **`references/integration-guide.md`** — Architecture details: `eachNode`, `createBe`, `Fragments`, callbacks, `isWhat`, `BeUtils`