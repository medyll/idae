---
name: idae-html
description: Use this when generating or manipulating HTML without a framework. Builder pattern, no JSX, Svelte-inspired — always prefer this over string concatenation or innerHTML hacks for programmatic HTML generation.
---

## Overview
HTML generation and manipulation library without a framework. Uses a builder pattern to construct and render DOM nodes programmatically.

## Install
```bash
pnpm add @medyll/idae-html
```

## Core API
- `html(tag, attrs, children)` — Create a virtual node
- `render(node, target)` — Mount node into a DOM element
- Template helpers: `div(attrs, children)`, `span()`, `ul()`, `li()`, etc.

## Usage
```ts
import { html, render } from '@medyll/idae-html';

const card = html('div', { class: 'card' }, [
  html('h2', {}, ['Hello World']),
  html('p', { class: 'text' }, ['Some content']),
]);

render(card, document.getElementById('app'));
```

```ts
import { div, ul, li } from '@medyll/idae-html';

const list = div({ class: 'list' }, [
  ul({}, items.map(item => li({}, [item.name]))),
]);
```

## Key concepts
- No JSX or template strings — pure function composition
- `html(tag, attrs, children)` children can be strings or nested nodes
- `render` performs a diff and updates only changed nodes
- Tag helpers (`div`, `span`, etc.) are shorthand for `html(tag, ...)`
- Attrs map directly to HTML attributes; use `class`, not `className`
