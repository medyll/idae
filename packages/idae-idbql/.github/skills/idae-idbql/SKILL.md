# idae-idbql Command Reference Skill

This skill provides a comprehensive list of all commands and methods available in the `@medyll/idae-idbql` library, accessible via the main entry point (`createIdbqlState`, `createIdbqDb`, or similar). Use this skill to discover, autocomplete, or document all available operations for IndexedDB collections managed by idae-idbql.

---

## Overview

The idae-idbql API exposes a MongoDB-like, chainable interface for working with IndexedDB collections. All collection methods are available via the `idbql` object returned from `createIdbqlState` or `createIdbqDb(...).create(...)`.

### Access Pattern

```typescript
const { idbql } = createIdbqDb(model, version).create('my_db');
// or
const idbql = createIdbqlState(idbqlCoreInstance);

// Access a collection:
idbql.users.method(...)
```

---

## Collection Methods

Each collection (e.g., `idbql.users`, `idbql.tasks`) exposes the following methods:

### Reading Data
- **where(query, options?)**: Advanced filtering with operator support. Returns a ResultSet or Promise<ResultSet>.
- **get(id, pathKey?)**: Get a single item by key (default: 'id').
- **getBy(value, pathKey?)**: Get all items matching a key/value pair.
- **getOne(id, pathKey?)**: Alias for `get` (deprecated).
- **getAll()**: Get all items in the collection.
- **count(query?)**: Count documents, optionally filtered by a query.

### Writing Data
- **put(data)**: Insert or update an item. Returns the inserted/updated item.
- **add(data)**: Insert a new item. Returns the inserted item.
- **update(id, changes)**: Update an item by key.
- **updateWhere(query, changes)**: Bulk update items matching a query.

### Deleting Data
- **delete(id)**: Delete an item by key.
- **del(id)**: Alias for `delete` (deprecated).
- **deleteWhere(query)**: Bulk delete items matching a query.

---

## Method Signatures

```typescript
// Reading
where(query: Where<T>, options?: ResultsetOptions): ResultSet<T> | Promise<ResultSet<T>>
get(id: any, pathKey?: string): T | undefined
getBy(value: any, pathKey?: string): ResultSet<T>
getOne(id: any, pathKey?: string): T | undefined // deprecated
getAll(): ResultSet<T> | Promise<T[]>
count(query?: Where<T>): Promise<number | undefined>

// Writing
put(data: Partial<T>): Promise<T | undefined>
add(data: T): Promise<T | undefined>
update(id: string | number, changes: Partial<T>): Promise<boolean | undefined>
updateWhere(query: Where<T>, changes: Partial<T>): Promise<boolean | undefined>

// Deleting
delete(id: string | number): Promise<boolean | undefined>
del(id: string | number): Promise<boolean | undefined> // deprecated
deleteWhere(query: Where<T>): Promise<boolean | undefined>
```

---

## Usage Example

```typescript
// Insert a user
await idbql.users.put({ name: 'Alice', age: 30 });

// Query users
const adults = await idbql.users.where({ age: { $gte: 18 } });

// Update users
await idbql.users.updateWhere({ active: true }, { lastLogin: Date.now() });

// Delete a user
await idbql.users.delete(123);
```

---

## Notes
- All methods are type-safe and support TypeScript generics.
- Query operators (`$gt`, `$in`, `$or`, etc.) are supported via `@medyll/idae-query`.
- For reactivity, use Svelte 5 runes or idae-stator as described in the main documentation.
- Deprecated methods (`getOne`, `del`) are included for backward compatibility.

---

## Advanced Examples

### Complex Query Example

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

### Svelte 5 Runes Example

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

### idae-stator Example

```typescript
import { createIdbqDb } from '@medyll/idae-idbql';

const { idbql } = createIdbqDb(model, 1, { engine: 'stator' }).create('my_app_db');

const query = idbql.users.where({ role: 'admin' });
query.onchange((oldValue, newValue) => {
	console.log('Data updated:', newValue);
});
```
