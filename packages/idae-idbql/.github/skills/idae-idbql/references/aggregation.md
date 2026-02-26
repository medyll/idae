# Aggregation & Transformation

## Statistical Analysis

```typescript
const stats = {
	total: idbql.users.count(),
	adults: idbql.users.count({ age: { $gte: 18 } }),
	averageAge: idbql.users.avg('age'),
	minAge: idbql.users.min('age'),
	maxAge: idbql.users.max('age'),
};
```

## Data Transformation Pipeline

```typescript
const report = idbql.users.where({ age: { $gte: 18 } })
	.reduce((acc, item) => {
		acc.total++;
		acc.ages.push(item.age);
		acc.names.push(item.name);
		return acc;
	}, { total: 0, ages: [], names: [] });
```

## Distinct with Filtering

```typescript
const uniqueRoles = idbql.users.distinct('role').pluck('role');
```