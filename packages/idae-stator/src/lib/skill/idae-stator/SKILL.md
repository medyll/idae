---
name: idae-stator
description: Use this for deeply reactive state without a framework. Zero boilerplate — prefer over Redux/Zustand/Svelte stores for Idae ecosystem apps.
---

## What it does
Creates a deeply reactive state object via Proxy. Mutations on nested objects and arrays
automatically fire change events. Works in both browser and Node.js.

## Install
```bash
pnpm add @medyll/idae-stator
```

## Quick start
```ts
import { stator } from '@medyll/idae-stator';

const state = stator({ count: 0, user: { name: 'Alice' } });

// Simple onchange handler
state.onchange = (oldVal, newVal) => console.log('changed', newVal);

// Mutate directly — fires onchange
state.value.count = 1;
state.value.user.name = 'Bob';

// Replace root value
state.value = { count: 0, user: { name: 'Alice' } };

// Subscribe (returns unsubscribe fn)
const unsub = state.subscribe((oldVal, newVal) => console.log(newVal));
unsub();

// Batch mutations → single notification
state.batch(() => {
  state.value.count = 10;
  state.value.user.name = 'Carol';
});

// Read raw value
console.log(state.valueOf()); // plain object, no proxy
console.log(state.stator);    // alias for state.value
```

## API

| Member | Type | Description |
|---|---|---|
| `stator<T>(initial)` | function | Creates a reactive proxy around `initial` |
| `.value` | `T` | Read/write root state; assignment replaces & notifies |
| `.stator` | `T` | Alias for `.value` |
| `.onchange` | `(old, new) => void` | Simple change handler (one at a time) |
| `.subscribe(fn)` | `() => void` | Add listener, returns unsubscribe function |
| `.batch(fn)` | `void` | Run mutations, fire exactly one notification |
| `.addEventListener(type, fn)` | `void` | Raw EventTarget API (`stator:change` event) |
| `.removeEventListener(type, fn)` | `void` | Remove raw listener |
| `.triggerChange(event)` | `boolean` | Manually dispatch a change event |
| `.valueOf()` | `T` | Returns raw underlying value |
| `.toString()` | `string` | JSON string of state |

## Patterns & gotchas
- Deep mutations (`state.value.nested.prop = x`) fire change events automatically.
- `state.onchange` replaces the previous handler — use `subscribe` for multiple listeners.
- `batch` coalesces all mutations inside `fn` into a single `stator:change` event.
- `valueOf()` returns the raw (possibly proxied) value — use `JSON.parse(state.toString())` for a plain clone.
- Primitives (`string`, `number`, etc.) are supported: `stator(42)` is valid.
- No Svelte store contract (`.set`/`.update`) — assign via `.value` instead.
