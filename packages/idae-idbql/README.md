
---

# 🚀 @medyll/idae-idbql

> **Flexible State Management meets powerful IndexedDB queries.** A reactive, type-safe wrapper for IndexedDB, compatible with **Svelte 5 Runes** or **idae-stator**.

## ✨ Features

* **Advanced Query Engine**: Use powerful operators like `$gt`, `$in`, `$or`, and more via a clean query object syntax.
* **State Agnostic**: Native support for **Svelte 5 Runes** or **idae-stator**.
* **Full CRUD + Logic**: Complete API for complex data manipulation (`updateWhere`, `deleteWhere`, etc.).
* **Type-Safe**: Deep type inference for your models and query results.

---

## 🚀 Quick Start

### 1. Define your model

```typescript
const model = {
    users: { keyPath: '++id', ts: {} as User },
    tasks: { keyPath: '++id, priority', ts: {} as Task }
};

```

### 2. Choose your State Engine

#### Option A: Svelte 5 (Runes)

Ideal for Svelte components. Use `$derived()` to keep your UI in sync with the database state.

```svelte
<script lang="ts">
import { createIdbqDb } from '@medyll/idae-idbql';

const { idbql } = createIdbqDb(model, 1).create('my_app_db');

// Use $derived to create reactive views of your data
let adults = $derived(idbql.users.where({ age: { $gte: 18 } }));
</script>

{#each adults.value as user}
    <p>{user.name}</p>
{/each}

```

#### Option B: idae-stator

Perfect for decoupled logic. Access state changes via the `onchange` callback.

```typescript
import { createIdbqDb } from '@medyll/idae-idbql';

const { idbql } = createIdbqDb(model, 1, { engine: 'stator' }).create('my_app_db');

const query = idbql.users.where({ role: 'admin' });

query.onchange((oldValue, newValue) => {
    console.log('Data updated:', newValue);
});

```

---

## 🛠 API Reference

### Reading Data

* `get(id)` / `getOne(query)` / `getAll()`
* `getBy(key, value)`
* `count(query)`
* `where(query)`: Advanced filtering with operator support.

### Writing Data

* `create(data)` / `put(data)`
* `update(id, changes)`
* `updateWhere(query, changes)`: Bulk updates based on criteria.

### Deleting Data

* `delete(id)`
* `deleteWhere(query)`: Bulk deletion based on criteria.

---

## 🔍 Query Example

```typescript
// Complex filtering with object-style syntax
const results = await idbql.posts.where({
    status: 'published',
    tags: { $in: ['svelte', 'idb'] },
    views: { $gt: 100 },
    $or: [
        { author: 'Mydde' },
        { featured: true }
    ]
}).toArray();

```

---

## 🏗 Project Structure

* **`Core`**: Lifecycle, versioning, and connection handling.
* **`Collection`**: CRUD abstraction and query engine.
* **`State`**: Bridging layer for **Svelte 5** and **idae-stator**.

---

## 🧪 Development

* **Test**: `npx vitest` (using `fake-indexeddb`).
* **Check**: `npm run check`.
* **Build**: `npm run build`.

---

## 📄 License

MIT © [Medyll](https://github.com/medyll)

---