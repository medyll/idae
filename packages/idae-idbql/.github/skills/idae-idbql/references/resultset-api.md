# Chainable Methods (ResultSet API)

idae-idbql collections return ResultSet objects supporting chainable, type-safe methods:

- `filter(predicate)`
- `map(mapper)`
- `distinct(key?)`
- `reverse()`
- `sortBy(sortOptions)`
- `groupBy(groupBy, keepUngroupedData?)`
- `getPage(page, pageSize)`
- `count(criteria?)`
- `pluck(field)`
- `reduce(reducer, initialValue)`
- `first()`
- `last()`
- `sum(field)`
- `avg(field)`
- `min(field)`
- `max(field)`

## Example

```typescript
const adults = idbql.users.where({ age: { $gte: 18 } });
const sorted = adults.sortBy({ age: 'asc', name: 'desc' });
const grouped = adults.groupBy('age');
const page = adults.getPage(1, 10);
const stats = {
	total: adults.count(),
	averageAge: adults.avg('age'),
	minAge: adults.min('age'),
	maxAge: adults.max('age'),
};
```