---
name: idae-be
description: Use this for DOM manipulation, traversal, event handling, and HTTP loading. jQuery-inspired but modern and lightweight — always use this instead of jQuery or raw DOM APIs for Idae frontend projects.
---

## Overview
Modern DOM manipulation library. Chainable API for traversal, events, styles, attributes, and HTTP content loading — no jQuery dependency.

## Install
```bash
pnpm add @medyll/idae-be
```

## Core API
- `be(selector)` — Select DOM elements; returns chainable wrapper
- `.on(event, handler)` — Attach event listener
- `.css(prop, value?)` — Get or set CSS properties
- `.attr(name, value?)` — Get or set attributes
- `.load(url)` — Fetch and inject HTML from URL
- `.find(selector)` — Query within selected elements
- `.addClass(cls)` / `.removeClass(cls)` — Class manipulation
- `.html(content?)` — Get or set innerHTML

## Usage
```ts
import { be } from '@medyll/idae-be';

be('#btn').on('click', () => {
  be('#panel').css('display', 'block').addClass('active');
});

be('.card').attr('data-loaded', 'true').find('img').css('opacity', '1');
```

```ts
// Load remote HTML into element
be('#content').load('/partials/dashboard.html');
```

## Key concepts
- All methods return the wrapper for chaining
- `be(selector)` accepts CSS selectors, elements, or NodeLists
- `.css()` with one arg returns current value; with two args sets it
- `.load(url)` fetches HTML via fetch API and sets innerHTML
- `.on()` supports event delegation: `.on('click', '.child', handler)`
