# Advanced Examples

## Complex Filtering

```typescript
const results = await idbql.posts.where({
	status: 'published',
	tags: { $in: ['svelte', 'idb'] },
	views: { $gt: 100 },
	$or: [
		{ author: 'Medyl' },
		{ featured: true }
	]
}).toArray();
```

## Pagination

```typescript
const page1 = idbql.users.getPage(1, 10);
const page2 = idbql.users.getPage(2, 10);
```

## Grouping

```typescript
const groupedByRole = idbql.users.groupBy('role');
const groupedByAge = idbql.users.groupBy('age');
```

## Chaining Example

```typescript
const admins = idbql.users.where({ role: 'admin' })
	.sortBy({ lastLogin: 'desc' })
	.getPage(1, 5)
	.pluck('name');
```

## Trivial Examples

```typescript
const firstUser = idbql.users.first();
const lastUser = idbql.users.last();
const totalUsers = idbql.users.count();
const sumAges = idbql.users.sum('age');
const minAge = idbql.users.min('age');
const maxAge = idbql.users.max('age');
```