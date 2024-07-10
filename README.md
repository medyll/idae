# idbql - IndexedDB Query Language

idbql is a powerful TypeScript library that provides a MongoDB-like query interface for IndexedDB, simplifying client-side database operations with strong typing and reactive state management.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
   - [createIdbqDb](#createidbqdb)
   - [idbql](#idbql)
   - [idbqlState](#idbqlstate)
   - [idbDatabase](#idbdatabase)
   - [idbqModel](#idbqmodel)
5. [Data Modeling](#data-modeling)
6. [Query Operators](#query-operators)
7. [Event Types](#event-types)
8. [Indexing](#indexing)
9. [Transactions](#transactions)
10. [Reactive State Management](#reactive-state-management)
11. [Integration with Svelte](#integration-with-svelte)
12. [Versioning and Migrations](#versioning-and-migrations)
13. [Error Handling](#error-handling)
14. [Performance Optimization](#performance-optimization)
15. [Contributing](#contributing)
16. [License](#license)

## Features

- MongoDB-like API for IndexedDB queries
- Strong typing with TypeScript for enhanced developer experience
- Reactive state management for real-time UI updates
- Support for complex CRUD operations and advanced querying
- Flexible and extensible data modeling
- Built-in indexing and optimization features
- Easy integration with front-end frameworks, especially Svelte
- Robust error handling and logging
- Versioning and database migration support

## Installation

Install idbql using npm:

```bash
npm install idbql
```

## Quick Start

Here's a basic example to get you started:

```typescript
import { createIdbqDb } from 'idbql';

// Define your data model
const exampleModel = {
  messages: {
    keyPath: "++id, chatId, created_at",
    ts: {} as ChatMessage,
  },
  chat: {
    keyPath: "&chatId, created_at, dateLastMessage",
    ts: {} as Chat,
    template: {},
  },
};

// Create a database instance
const idbqStore = createIdbqDb(exampleModel, 1);
const { idbql, idbqlState, idbDatabase, idbqModel } = idbqStore.create("myDatabase");

// Perform database operations
async function fetchMessages() {
  const messages = await idbql.messages.where({ chatId: "123" }).toArray();
  console.log(messages);
}

fetchMessages();
```

## API Reference

### createIdbqDb

`createIdbqDb(model: IdbqModel, version: number)`

Creates an IndexedDB database instance with the specified model and version.

- `model`: An object describing your database schema
- `version`: The version number of your database schema

Returns an object with a `create` method to initialize the database.

### idbql

The main interface for database operations. It provides methods for each collection defined in your model.

Example operations:

```typescript
// Add a new item
await idbql.messages.add({ chatId: "123", content: "Hello" });

// Update an item
await idbql.messages.put({ id: 1, content: "Updated message" });

// Delete an item
await idbql.messages.delete(1);

// Query items
const recentMessages = await idbql.messages
  .where({ created_at: { gt: new Date(Date.now() - 86400000) } })
  .toArray();
```

### idbqlState

A reactive state object that reflects the current state of your database. It's particularly useful for integrating with reactive UI frameworks.

### idbDatabase

Provides low-level access to the IndexedDB instance, allowing for more advanced operations when needed.

### idbqModel

Contains the database model definition, useful for introspection and dynamic querying.

## Data Modeling

Define your data model using the `IdbqModel` type:

```typescript
type IdbqModel = {
  [collectionName: string]: {
    keyPath: string;
    ts: any; // TypeScript type for the collection
    template?: object; // Optional default values
  };
};
```

Example:

```typescript
const myModel: IdbqModel = {
  users: {
    keyPath: "++id, email",
    ts: {} as User,
    template: { role: "user" },
  },
  posts: {
    keyPath: "++id, userId, createdAt",
    ts: {} as Post,
  },
};
```

## Query Operators

idbql supports a wide range of query operators:

- `eq`: Equal to
- `ne`: Not equal to
- `gt`: Greater than
- `gte`: Greater than or equal to
- `lt`: Less than
- `lte`: Less than or equal to
- `in`: In array
- `nin`: Not in array
- `contains`: String contains
- `startsWith`: String starts with
- `endsWith`: String ends with
- `btw`: Between (inclusive)

Example usage:

```typescript
const results = await idbql.users.where({
  age: { gte: 18, lte: 65 },
  name: { startsWith: "A" },
  role: { in: ["admin", "moderator"] },
}).toArray();
```

## Event Types

idbql uses a set of event types to represent different database operations:

```typescript
/**
 * Represents the types of database operations that can be performed.
 * 
 * @typedef {string} EventType
 * @property {string} add - Add a new record
 * @property {string} put - Put (insert or update) a record
 * @property {string} update - Update an existing record
 * @property {string} updateWhere - Update records that match a condition
 * @property {string} delete - Delete a specific record
 * @property {string} deleteWhere - Delete records that match a condition
 * @property {string} set - Set the value of a record
 */
export type EventType =
  | "add"
  | "put"
  | "update"
  | "updateWhere"
  | "delete"
  | "deleteWhere"
  | "set";
```

These event types are used internally and can be useful when working with database change events or custom middleware.

## Indexing

Indexing is crucial for query performance. Define indexes in your model's `keyPath`:

```typescript
const model = {
  users: {
    keyPath: "++id, email, &username, *tags",
    // ...
  },
};
```

- `++id`: Auto-incrementing primary key
- `email`: Regular index
- `&username`: Unique index
- `*tags`: Multi-entry index for arrays

## Transactions

idbql supports complex transactions across multiple object stores, ensuring data consistency and atomicity. Here's how you can use transactions:

### Basic Transaction

```typescript
const result = await idbql.transaction(
  ["users", "posts"],
  "readwrite",
  async (tx) => {
    const userStore = tx.objectStore("users");
    const postStore = tx.objectStore("posts");

    const userId = await userStore.add({ name: "Alice", email: "alice@example.com" });
    const postId = await postStore.add({ userId, title: "Alice's First Post", content: "Hello, World!" });

    return { userId, postId };
  }
);

console.log("New user ID:", result.userId);
console.log("New post ID:", result.postId);
```

## Reactive State Management

`idbqlState` provides a reactive interface to your data:

```typescript
import { derived } from 'svelte/store';

const activeUsers = $derived(idbqlState.users.where({ isActive: true }));
```

## Integration with Svelte

Svelte 5 example:

```svelte
<script>
import { derived } from 'svelte/store';
import { idbqlState } from './store';

const messages = $derived(idbqlState.messages.where({ chatId: "123" }));
</script>

{#each $messages as message}
  <p>{message.content}</p>
{/each}
```

## Versioning and Migrations

Handle database schema changes with versioning:

```typescript
const idbqStore = createIdbqDb(myModel, 2);
const { idbDatabase } = idbqStore.create("myDb", {
  upgrade(oldVersion, newVersion, transaction) {
    if (oldVersion < 2) {
      const userStore = transaction.objectStore("users");
      userStore.createIndex("emailIndex", "email", { unique: true });
    }
  },
});
```

## Error Handling

idbql provides detailed error information:

```typescript
try {
  await idbql.users.add({ username: "existing_user" });
} catch (error) {
  if (error instanceof UniqueConstraintError) {
    console.error("Username already exists");
  } else {
    console.error("An unexpected error occurred", error);
  }
}
```

## Performance Optimization

- Use appropriate indexes
- Limit result sets with `.limit(n)`
- Use `.count()` instead of `.toArray().length`
- Optimize queries to use indexes effectively

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).