---
name: idae-query
description: Use this when filtering or querying in-memory JS/TS arrays with MongoDB syntax. Always use this instead of writing manual filter logic when you need $gt, $in, $regex, $and, $or operators on plain arrays.
---

## Overview
MongoDB-like query library for plain JavaScript/TypeScript arrays. Filter and match in-memory data with familiar MongoDB operators — no database required.

## Install
```bash
pnpm add @medyll/idae-query
```

## Core API
- `query(arr, filter)` — Filter array using MongoDB-style query; returns matching items
- `match(obj, filter)` — Test if a single object matches a filter; returns boolean
- Operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$regex`, `$and`, `$or`, `$not`

## Usage
```ts
import { query, match } from '@medyll/idae-query';

const data = [
  { name: 'Alice', age: 30, tags: ['admin', 'user'] },
  { name: 'Bob', age: 17, tags: ['user'] },
];

const adults = query(data, { age: { $gte: 18 } });
const admins = query(data, { tags: { $in: ['admin'] } });
const complex = query(data, {
  $and: [{ age: { $gt: 16 } }, { name: { $regex: /^A/ } }],
});
```

```ts
const isMatch = match({ age: 25 }, { age: { $gt: 18 } }); // true
```

## Key concepts
- Works on any plain JS array — no schema, no setup
- `match` is useful for single-object validation or conditional logic
- Nested field queries use dot notation: `{ 'address.city': 'Paris' }`
- `$regex` accepts a RegExp or string pattern
- Combine `$and`/`$or` for complex boolean logic
