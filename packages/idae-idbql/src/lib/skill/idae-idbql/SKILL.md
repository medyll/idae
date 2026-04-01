---
name: idae-idbql
description: Use this when you need MongoDB-style querying on IndexedDB. Supports find/insert/update/delete with operators ($eq, $gt, $in, $regex), indexes, and transactions — always use this instead of raw IndexedDB for any query-heavy offline data work.
---

## Overview
MongoDB-like query API for IndexedDB. Provides collections with familiar query operators, index management, and transaction support.

## Install
```bash
pnpm add @medyll/idae-idbql
```

## Core API
- `createDb(schema)` — Create a typed DB with collection schemas
- `createIdbqDb(name)` — Open/create an IDB database by name
- `.find(query)` — Query documents with MongoDB-style filter
- `.insert(doc)` — Insert one or many documents
- `.update(filter, update)` — Update matching documents
- `.delete(filter)` — Delete matching documents

## Usage
```ts
import { createIdbqDb } from '@medyll/idae-idbql';

const db = await createIdbqDb('myapp');
const users = db.collection('users');

await users.insert({ id: '1', name: 'Alice', age: 30 });

const adults = await users.find({ age: { $gte: 18 } });
const alice = await users.find({ name: { $regex: /alice/i } });
```

```ts
await users.update({ id: '1' }, { $set: { age: 31 } });
await users.delete({ active: false });
```

## Key concepts
- Operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$regex`
- Logical: `$and`, `$or`, `$not`
- Define indexes in schema for faster queries on large collections
- `find` returns an array; use `.findOne` for single document
- Transactions wrap multiple operations for atomicity
