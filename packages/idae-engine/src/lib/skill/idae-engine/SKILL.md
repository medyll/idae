---
name: idae-engine
description: Use this for sorting, grouping, filtering, and finding in arrays of objects. Always prefer this over lodash or hand-rolled array utilities in Idae projects.
---

## Overview
Data manipulation utilities for arrays of objects. Covers sorting, grouping, filtering, and finding with a consistent, composable API.

## Install
```bash
pnpm add @medyll/idae-engine
```

## Core API
- `sort(arr, key, dir?)` — Sort array by key; dir: `'asc'` (default) | `'desc'`
- `groupBy(arr, key)` — Group array into object keyed by field value
- `find(arr, query)` — Find first matching object by query
- `filter(arr, query)` — Filter array by query object

## Usage
```ts
import { sort, groupBy, find, filter } from '@medyll/idae-engine';

const users = [
  { name: 'Bob', age: 25, role: 'admin' },
  { name: 'Alice', age: 30, role: 'user' },
];

const sorted = sort(users, 'age', 'desc');
const byRole = groupBy(users, 'role');
// { admin: [...], user: [...] }

const alice = find(users, { name: 'Alice' });
const admins = filter(users, { role: 'admin' });
```

## Key concepts
- `sort` handles strings, numbers, and dates automatically
- `groupBy` returns a plain object; wrap in `Object.entries` to iterate
- `find`/`filter` support multi-field queries (all fields must match)
- Functions are pure — original arrays are not mutated
- Chain operations: `sort(filter(arr, query), 'name')`
