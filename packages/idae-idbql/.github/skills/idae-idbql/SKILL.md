---
name: idae-idbql-commands
description: Modular command and API reference for @medyll/idae-idbql. All details are in referenced markdown files.
---

# idae-idbql Command Reference Skill

This skill is modular. Each section is referenced as a separate markdown file in `skills/idae-idbql/references`.

---

## Sections

- [Overview](references/overview.md)
- [Collection Methods](references/collection-methods.md)
- [Query Syntax & Operators](references/query-syntax.md)
- [Chainable Methods (ResultSet API)](references/resultset-api.md)
- [Aggregation & Transformation](references/aggregation.md)
- [Custom Operators](references/custom-operators.md)
- [Type Safety & Generics](references/type-safety.md)
- [Reactivity](references/reactivity.md)
- [Compatibility](references/compatibility.md)
- [Usage Examples](references/usage-examples.md)
- [Advanced Examples](references/advanced-examples.md)
- [Notes](references/notes.md)

---

For full details, see:
- [idae-idbql README](README.md)
- [idae-query README](https://github.com/medyll/idae-query)
- [AGENTS.md](../../AGENTS.md)
- [copilot-instructions.md](../../.github/copilot-instructions.md)
		acc.ages.push(item.age);
		acc.names.push(item.name);
		return acc;
	}, { total: 0, ages: [], names: [] });

// Distinct with filtering
const uniqueRoles = idbql.users.distinct('role').pluck('role');
```

---

## Custom Operators

You can add custom operators via `idae-query`:
```typescript
import { Operators } from '@medyll/idae-query';
Operators.addCustomOperator('isEven', (field, value, data) => data[field] % 2 === 0);
const evenUsers = idbql.users.where({ age: { isEven: true } });
```

---

## Type Safety & Generics

All methods are fully type-safe and support deep generics. Define your model types for maximum safety:
```typescript
type User = { id: number; name: string; age: number; metadata: { order: number } };
const model = { users: { keyPath: '++id', ts: {} as User } };
const { idbql } = createIdbqDb(model, 1).create('my_db');
```

---

## Reactivity

idae-idbql is state-agnostic. Use Svelte 5 runes (`$derived`, `$state`) or idae-stator for reactive updates. All query chains are compatible with Svelte 5 reactivity.

---

## Compatibility

- Fully compatible with all idae-query methods and syntax
- IndexedDB persistence with MongoDB-like querying
- Works in browser environments
- Supports Svelte 5 and idae-stator for reactivity

---

## See Also

- [idae-query README](https://github.com/medyll/idae-query)
- [idae-idbql README](README.md)

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
