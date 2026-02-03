# @medyll/idae-query

A powerful and flexible query library for TypeScript and JavaScript applications.


## Features

- Chainable and iterable result sets
- Sorting, grouping, and pagination support
- Dot path resolution for nested properties
- Integration with `@medyll/idae-engine` for data operations
- **Advanced filtering** with `filter()`, `map()`, `distinct()`, `reverse()`
- **Numeric aggregations** with `sum()`, `avg()`, `min()`, `max()`
- **Data extraction** with `pluck()`, `reduce()`, `first()`, `last()`
- **Flexible counting** with optional filtering via `count()`
- **Full TypeScript support** with type-safe aggregations
- **Dot-path support** for nested property access on all methods

## Key Features

### ✨ Rich Method Toolkit
- **13+ chainable methods** for data manipulation and transformation
- **Fluent API** - Chain operations for clean, readable code
- **Type-safe aggregations** - TypeScript prevents operations on incompatible types
- **Dot-path resolution** - Access nested properties with string paths (e.g., `'metadata.order'`)
- **Zero dependencies** - Lightweight and efficient
- **Full test coverage** - 79 comprehensive unit tests

### 🔗 Method Categories
1. **Transformation Methods** (chainable)
   - `filter()` - Filter by predicate
   - `map()` - Transform items
   - `distinct()` - Remove duplicates
   - `reverse()` - Reverse order

2. **Aggregation Methods** (numeric, with dot-path support)
   - `sum()`, `avg()`, `min()`, `max()` - Statistical operations

3. **Utility Methods** (terminal operations)
   - `count()`, `pluck()`, `reduce()`, `first()`, `last()` - Extraction and reduction

4. **Original Methods**
   - `sortBy()`, `groupBy()`, `getPage()` - Sorting, grouping, pagination

## Installation

```bash
npm install @medyll/idae-query
```

## Quick Start

Here's a quick example to get you started:

```typescript
import { Query } from '@medyll/idae-query';

const data = [
  { id: 1, name: 'John', age: 25, metadata: { order: 1 } },
  { id: 2, name: 'Jane', age: 30, metadata: { order: 2 } },
  { id: 3, name: 'Bob', age: 35, metadata: { order: 3 } },
  { id: 4, name: 'Alice', age: 40, metadata: { order: 4 } },
];

const query = new Query(data);

// Filtering with where()
const adults = query.where({ age: { gte: 30 } });

// Sorting
const sortedData = adults.sortBy({ age: 'asc' });

// Grouping
const groupedData = adults.groupBy('age');

// Pagination
const pageData = adults.getPage(1, 2);

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
const query = new Query(data);
const sorted = query.where({}).sortBy({ age: 'asc', name: 'desc' });
// Sort first by age ascending, then by name descending
```

### Grouping by Nested Property
```typescript
const query = new Query(data);
const grouped = query.where({}).groupBy('metadata.order');
// Groups by the nested property metadata.order
```

### Pagination
```typescript
const query = new Query(data);
const resultSet = query.where({});
const page1 = resultSet.getPage(1, 2); // Page 1, 2 items
const page2 = resultSet.getPage(2, 2); // Page 2, 2 items
```

### New Methods Overview

The library now includes 13 powerful methods for data manipulation:

#### Transformation Methods (Chainable - return `ResultSet<T>`)

**`filter(predicate: (item: T) => boolean): ResultSet<T>`**
```typescript
const adults = resultSet.filter((item) => item.age >= 18);
const filtered = resultSet.filter((item) => item.age > 25).sortBy({ name: 'asc' });
```

**`map<U>(mapper: (item: T) => U): ResultSet<U>`**
```typescript
const transformed = resultSet.map((item) => ({ 
  name: item.name, 
  isAdult: item.age >= 18 
}));
```

**`distinct(key?: DotPath<T>): ResultSet<T>`**
```typescript
const unique = resultSet.distinct();  // Remove exact duplicates
const uniqueByAge = resultSet.distinct('age');  // By field
const uniqueByOrder = resultSet.distinct('metadata.order');  // By dot-path
```

**`reverse(): ResultSet<T>`**
```typescript
const reversed = resultSet.reverse();
const reversedAndSorted = resultSet.reverse().sortBy({ age: 'asc' });
```

#### Aggregation Methods (Numeric operations with dot-path support)

**`sum(field: DotPath<T>): number`** - Sum all values in a numeric field
```typescript
const totalAge = resultSet.sum('age');
const totalDiscount = resultSet.sum('metadata.discount');
```

**`avg(field: DotPath<T>): number`** - Calculate average of numeric values
```typescript
const averageAge = resultSet.avg('age');
```

**`min(field: DotPath<T>): number`** - Get minimum numeric value
```typescript
const youngest = resultSet.min('age');
```

**`max(field: DotPath<T>): number`** - Get maximum numeric value
```typescript
const oldest = resultSet.max('age');
```

#### Utility Methods (Terminal operations)

**`count(criteria?: Where<T>): number`** - Count items with optional filtering
```typescript
const total = resultSet.count();
const adultsCount = resultSet.count({ age: { gt: 18 } });
const filtered = resultSet.count({ name: { contains: 'John' } });
```

**`pluck(field: DotPath<T>): any[]`** - Extract array of field values
```typescript
const ages = resultSet.pluck('age');  // [25, 30, 35, 40]
const orders = resultSet.pluck('metadata.order');  // Dot-path support
```

**`reduce<U>(reducer: (acc: U, item: T) => U, initialValue: U): U`** - Custom reduction
```typescript
const ageMap = resultSet.reduce((acc, item) => {
  acc[item.name] = item.age;
  return acc;
}, {});

const totalAge = resultSet.reduce((sum, item) => sum + item.age, 0);
```

**`first(): T | undefined`** - Get first item
```typescript
const first = resultSet.filter((x) => x.age > 30).first();
```

**`last(): T | undefined`** - Get last item
```typescript
const last = resultSet.sortBy({ age: 'desc' }).last();
```

### Advanced Usage Examples

#### Chaining Operations
```typescript
const query = new Query(data);

// Multi-step transformation
const result = query
  .where({ age: { gt: 25 } })
  .sortBy({ age: 'asc' })
  .pluck('name');  // ['Jane', 'Bob', 'Alice']
```

#### Statistical Analysis
```typescript
const query = new Query(data);
const resultSet = query.where({});

// Calculate statistics on data
const stats = {
  total: resultSet.count(),
  adults: resultSet.count({ age: { gte: 18 } }),
  averageAge: resultSet.avg('age'),
  minAge: resultSet.min('age'),
  maxAge: resultSet.max('age'),
};
```

#### Data Transformation Pipeline
```typescript
const query = new Query(data);

// Build a summary report
const report = query
  .where({ age: { gte: 18 } })
  .reduce((acc, item) => {
    acc.total++;
    acc.ages.push(item.age);
    acc.names.push(item.name);
    return acc;
  }, { total: 0, ages: [], names: [] });
```

#### Distinct with Filtering
```typescript
const query = new Query(data);

// Find unique categories
const uniqueMetadata = query
  .where({})
  .distinct('metadata.order')
  .pluck('metadata.order');
```

### Combined Examples
```typescript
const query = new Query(data);
const resultSet = query.where({});

// Sorting and grouping
const sorted = resultSet.sortBy({ age: 'asc' }).groupBy('age');

// Pagination with filtering
const page = query
  .where({ age: { gt: 25 } })
  .getPage(1, 10);

// Complex query chain
const summary = {
  count: resultSet.count({ age: { gt: 30 } }),
  names: query
    .where({ age: { gt: 30 } })
    .pluck('name'),
  maxAge: resultSet.max('age'),
};
```

All operators are accessed through `Query` (primary API). `ResultSet` is returned by `Query.where()` and shouldn’t be used directly.

### Query Operators Reference
```typescript
import { Query, Operators } from '@medyll/idae-query';

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 },
];

const query = new Query(data);

// eq - equals
const eqResult = query.where({ age: { eq: 30 } }); // [{ id: 2, name: 'Jane', age: 30 }]

// gt - greater than
const gtResult = query.where({ age: { gt: 25 } }); // [{ id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// gte - greater than or equal
const gteResult = query.where({ age: { gte: 30 } }); // [{ id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// lt - less than
const ltResult = query.where({ age: { lt: 30 } }); // [{ id: 1, name: 'John', age: 25 }]

// lte - less than or equal
const lteResult = query.where({ age: { lte: 30 } }); // [{ id: 1, name: 'John', age: 25 }, { id: 2, name: 'Jane', age: 30 }]

// ne - not equal
const neResult = query.where({ age: { ne: 25 } }); // [{ id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// in - value in array
const inResult = query.where({ age: { in: [25, 35] } }); // [{ id: 1, name: 'John', age: 25 }, { id: 3, name: 'Bob', age: 35 }]

// nin - value not in array
const ninResult = query.where({ age: { nin: [25, 35] } }); // [{ id: 2, name: 'Jane', age: 30 }]

// contains - string contains
const containsResult = query.where({ name: { contains: 'an' } }); // [{ id: 2, name: 'Jane', age: 30 }]

// startsWith - string starts with
const startsWithResult = query.where({ name: { startsWith: 'Ja' } }); // [{ id: 2, name: 'Jane', age: 30 }]

// endsWith - string ends with
const endsWithResult = query.where({ name: { endsWith: 'hn' } }); // [{ id: 1, name: 'John', age: 25 }]

// btw - between (inclusive)
const btwResult = query.where({ age: { btw: [25, 35] } }); // [{ id: 1, name: 'John', age: 25 }, { id: 2, name: 'Jane', age: 30 }, { id: 3, name: 'Bob', age: 35 }]

// Combined operators
const combinedResult = query.where({ age: { gt: 15, lt: 35 } }); // [{ id: 1, name: 'John', age: 25 }, { id: 2, name: 'Jane', age: 30 }]

// Custom operator
Operators.addCustomOperator('isEven', (field, value, data) => data[field] % 2 === 0);
const customResult = query.where({ age: { isEven: true } }); // [{ id: 2, name: 'Jane', age: 30 }]
```

## API

### `Query<T>`

Primary entry point for building queries. `Query` owns the dataset and exposes `where()` to return a `ResultSet` for chaining transformations and aggregations. It is the intended public API.

### `getResultset(data: any[]): ResultSet`

Low-level helper that creates a new result set from the provided data. Prefer `Query` in application code.

### `ResultSet<T>`

Chainable result set returned by `Query.where()`. It isn’t intended to be used directly.

#### Transformation Methods (Chainable)

- `filter(predicate: (item: T) => boolean): ResultSet<T>` - Filter items by predicate function
- `map<U>(mapper: (item: T) => U): ResultSet<U>` - Transform items using mapper function
- `distinct(key?: DotPath<T>): ResultSet<T>` - Remove duplicate items, optionally by key with dot-path support
- `reverse(): ResultSet<T>` - Reverse the order of items

#### Aggregation Methods (Numeric, dot-path supported)

- `sum(field: DotPath<T>): number` - Sum numeric values of a field
- `avg(field: DotPath<T>): number` - Calculate average of numeric values
- `min(field: DotPath<T>): number` - Get minimum numeric value
- `max(field: DotPath<T>): number` - Get maximum numeric value

#### Utility Methods (Terminal Operations)

- `count(criteria?: Where<T>): number` - Count items, optionally filtered by criteria
- `pluck(field: DotPath<T>): any[]` - Extract values of a field with dot-path support
- `reduce<U>(reducer: (acc: U, item: T) => U, initialValue: U): U` - Reduce items to a single value
- `first(): T | undefined` - Get first item or undefined
- `last(): T | undefined` - Get last item or undefined

#### Original Methods (Sorting, Grouping, Pagination)

- `setOptions(options: ResultsetOptions): ResultSet` - Sets options for the result set
- `sortBy(sortOptions: Record<DotPath, 'asc' | 'desc'>): ResultSet` - Sorts the result set by the specified options (supports multi-criteria and dot-path)
- `groupBy(groupBy: DotPath, keepUngroupedData?: boolean): Record<string, any[]>` - Groups the result set by the specified property
- `getPage(page: number, pageSize: number): ResultSet` - Gets the specified page of data

## Testing

To run the tests:

1. Clone the repository
2. Install dependencies: `pnpm install` or `yarn install`
3. Run tests: `pnpm test` or `yarn test`

The tests cover various scenarios for each method, ensuring the reliability and correctness of the `ResultSet` class.

## License

This project is licensed under the MIT License.

