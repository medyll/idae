# @medyll/idae-stator ⚡

**idae-stator** is a lightweight, universal, and deeply reactive state management library for JavaScript and TypeScript. It uses native `Proxy` to track changes at any depth and provides a unified `EventTarget` API for both Browser and Node.js environments.

## 🚀 Key Features

* **Deep Reactivity:** Automatically tracks mutations in nested objects and arrays.
* **Zero Dependencies:** Extremely small footprint.
* **Universal (Isomorphic):** Works out of the box in the Browser, Node.js, and SSR environments.
* **Flexible API:** Support for both standard `onchange` callbacks and `addEventListener` patterns.
* **Developer Friendly:** Seamless integration with TypeScript, providing full intellisense for your state structures.
* **Smart Updates:** Built-in protection against redundant notifications for primitive values.

---

## 📦 Installation

```bash
npm install @medyll/idae-stator

```

---

## 🛠 Usage

### Basic Reactivity with Primitives

```typescript
import { stator } from '@medyll/idae-stator';

// For primitive values, use state.value to get/set
const counter = stator(0);

counter.onchange = (newValue) => {
  console.log(`Count updated to: ${newValue}`);
};

counter.value = 1; // Console: Count updated to: 1

```

### Object Reactivity

```typescript
import { stator } from '@medyll/idae-stator';

const state = stator({ count: 0 });

state.onchange = (newValue) => {
  console.log(`Count updated to: ${newValue.count}`);
};

// Access object properties via state.value or state.stator
state.value.count++; // Console: Count updated to: 1

```

### Deep Nesting & Arrays

The library handles deep structures without any extra configuration.

```typescript
const appState = stator({
  user: {
    profile: { name: 'Mydde' },
    tags: ['dev', 'js']
  }
});

appState.onchange = (val) => console.log('State changed!');

// All these mutations trigger the reactivity:
appState.stator.user.profile.name = 'Mydde Dev';
appState.stator.user.tags.push('stator');

```

### Event-Driven Pattern

If you prefer standard web events or need multiple listeners:

```typescript
const state = stator({ status: 'idle' });

state.addEventListener('stator:change', (event) => {
  const { newValue } = event.detail;
  console.log('New status:', newValue.status);
});

state.stator.status = 'loading';

```

### Type Safety (TypeScript)

**idae-stator** preserves your types and augments them with reactive properties.

```typescript
interface User {
  id: number;
  role: string;
}

const state = stator<User>({ id: 1, role: 'admin' });
// 'state' is now typed as AugmentedState<User>
// Access via state.value or state.stator

```

---

## ⚙️ Technical Overview

### The Reactivity Engine

The core of the library is built around a recursive `Proxy` system. When you access a nested object, **idae-stator** wraps it on-the-fly (and caches it using a `WeakMap`) to ensure that every leaf of your data tree becomes an observable entry point.

### Universal Event Bus

To ensure compatibility with Node.js (where `EventTarget` was historically missing or inconsistent), **idae-stator** implements a smart polyfill:

1. **Browser:** Uses native `window.EventTarget`.
2. **Legacy/DOM:** Uses an invisible DOM element as an event bridge.
3. **Node.js:** Uses a custom high-performance event registry.

---

## 💎 Utility Properties

* **`state.value`**: Access and mutate the current state value (recommended).
* **`state.stator`**: Alias for `state.value` - access the reactive state data.
* **`state.onchange`**: Callback triggered on any state mutation.
* **`state.addEventListener('stator:change', fn)`**: Standard event listener for change events.
* **`state.removeEventListener('stator:change', fn)`**: Remove a previously attached listener.
* **`state.triggerChange(event)`**: Manually dispatch a change event.
* **`state.toString()`**: Returns a `JSON.stringify` version of your state.
* **`state.valueOf()`**: Returns the underlying raw value for comparisons.
* **`Symbol.toPrimitive`**: Allows the state to be used directly in arithmetic (e.g., `state + 1` for primitive states).

---

## 📜 License

MIT © [Medyll](https://github.com/medyll)