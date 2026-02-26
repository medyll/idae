# Query Syntax & Operators

idae-idbql supports advanced query syntax and operators from idae-query.

## Supported Operators

- `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$contains`, `$startsWith`, `$endsWith`, `$btw`, `$or`, `$and`

## Example

```typescript
idbql.users.where({
	age: { $gt: 18 },
	name: { $contains: 'Jo' },
	$or: [
		{ status: 'active' },
		{ featured: true }
	]
});
```

## Dot-path Resolution

Query and transformation methods support dot-paths for nested property access:

```typescript
idbql.orders.where({ 'metadata.order': { $eq: 2 } });
idbql.orders.sortBy({ 'metadata.order': 'asc' });
```