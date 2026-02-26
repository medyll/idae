# Usage Examples

## Basic CRUD

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

## Query with Operators

```typescript
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

## Svelte 5 Runes Example

```svelte
<script lang="ts">
import { createIdbqDb } from '@medyll/idae-idbql';

const { idbql } = createIdbqDb(model, 1).create('my_app_db');

let adults = $derived(idbql.users.where({ age: { $gte: 18 } }));
</script>

{#each adults.value as user}
	<p>{user.name}</p>
{/each}
```

## Distinct and Aggregation

```typescript
const uniqueRoles = idbql.users.distinct('role').pluck('role');
const stats = {
	total: idbql.users.count(),
	averageAge: idbql.users.avg('age'),
	minAge: idbql.users.min('age'),
	maxAge: idbql.users.max('age'),
};
```