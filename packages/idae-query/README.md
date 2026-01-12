# @medyll/idae-query

A powerful and flexible query library for TypeScript and JavaScript applications.

## Features

- Chainable and iterable result sets
- Sorting, grouping, and pagination support
- Dot path resolution for nested properties
- Integration with `@medyll/idae-engine` for data operations

## Installation

```bash
npm install @medyll/idae-query
```

## Quick Start

Here's a quick example to get you started:

```typescript
import { getResultset } from '@medyll/idae-query';

const data = [
  { id: 1, name: 'John', age: 25, metadata: { order: 1 } },
  { id: 2, name: 'Jane', age: 30, metadata: { order: 2 } },
  { id: 3, name: 'Bob', age: 35, metadata: { order: 3 } },
  { id: 4, name: 'Alice', age: 40, metadata: { order: 4 } },
];

const resultSet = getResultset(data);

// Sorting
const sortedData = resultSet.sortBy({ age: 'asc' });

// Grouping
const groupedData = resultSet.groupBy('age');

// Pagination
const pageData = resultSet.getPage(1, 2);

console.log(sortedData);
console.log(groupedData);
console.log(pageData);
```

## API

## Operators Demo

## Query Operators Usage

## Advanced Usage

### Multi-criteria Sorting
```typescript
const resultSet = getResultset(data);
const sorted = resultSet.sortBy({ age: 'asc', name: 'desc' });
// Tri d'abord par age croissant, puis par name décroissant
```

### Grouping by Nested Property
```typescript
const resultSet = getResultset(data);
const grouped = resultSet.groupBy('metadata.order');
// Regroupe par la propriété imbriquée metadata.order
```

### Pagination
```typescript
const resultSet = getResultset(data);
const page1 = resultSet.getPage(1, 2); // Page 1, 2 éléments
const page2 = resultSet.getPage(2, 2); // Page 2, 2 éléments
```

### Combined Example
```typescript
const resultSet = getResultset(data)
  .sortBy({ age: 'asc' })
  .groupBy('age');
const page = resultSet.getPage(1, 2);
```

All operators are used via the main API (`getResultset` or `Query`).

### Example with getResultset
```typescript
import { getResultset } from '@medyll/idae-query';

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 },
];

const resultSet = getResultset(data);

// eq
const eqResult = resultSet.where({ age: { eq: 30 } }); // [{ id: 2, name: 'Jane', age: 30 }]

// gt
const gtResult = resultSet.where({ age: { gt: 25 } }); // [{ id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// gte
const gteResult = resultSet.where({ age: { gte: 30 } }); // [{ id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// lt
const ltResult = resultSet.where({ age: { lt: 30 } }); // [{ id: 1, name: 'John', age: 25 }]

// lte
const lteResult = resultSet.where({ age: { lte: 30 } }); // [{ id: 1, name: 'John', age: 25 }, { id: 2, name: 'Jane', age: 30 }]

// ne
const neResult = resultSet.where({ age: { ne: 25 } }); // [{ id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// in
const inResult = resultSet.where({ age: { in: [25, 35] } }); // [{ id: 1, name: 'John', age: 25 }, { id: 3, name: 'Bob', age: 35 }]

// nin
const ninResult = resultSet.where({ age: { nin: [25, 35] } }); // [{ id: 2, name: 'Jane', age: 30 }]

// contains
const containsResult = resultSet.where({ name: { contains: 'an' } }); // [{ id: 2, name: 'Jane', age: 30 }]

// startsWith
const startsWithResult = resultSet.where({ name: { startsWith: 'Ja' } }); // [{ id: 2, name: 'Jane', age: 30 }]

// endsWith
const endsWithResult = resultSet.where({ name: { endsWith: 'hn' } }); // [{ id: 1, name: 'John', age: 25 }]

// btw
const btwResult = resultSet.where({ age: { btw: [25, 35] } }); // [{ id: 1, name: 'John', age: 25 }, { id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// Custom operator
import { Operators } from '@medyll/idae-query';
Operators.addCustomOperator('isEven', (field, value, data) => data[field] % 2 === 0);
const customResult = resultSet.where({ age: { isEven: true } }); // [{ id: 2, name: 'Jane', age: 30 }]
```

### Example with Query class
```typescript
import { Query } from '@medyll/idae-query';

const data = [
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 },
];

const query = new Query(data);
const result = query.where({ value: { gt: 15, lt: 30 } }); // [{ id: 2, value: 20 }]
```

## API

### `getResultset(data: any[]): ResultSet`

Creates a new result set from the provided data.

### `ResultSet`

A chainable and iterable result set of data.

#### Methods

- `setOptions(options: ResultsetOptions): ResultSet` - Sets options for the result set.
- `sortBy(sortOptions: Record<DotPath, 'asc' | 'desc'>): ResultSet` - Sorts the result set by the specified options.
- `groupBy(groupBy: DotPath): Record<string, any[]>` - Groups the result set by the specified property.
- `getPage(page: number, pageSize: number): any[]` - Gets the specified page of data.

## Testing

To run the tests:

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Run tests: `npm test` or `yarn test`

The tests cover various scenarios for each method, ensuring the reliability and correctness of the `ResultSet` class.

## License

This project is licensed under the MIT License.

