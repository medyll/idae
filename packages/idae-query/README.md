# @medyll/idae-idbql

A powerful and flexible IndexedDB query library for TypeScript and JavaScript applications.

## Features

- MongoDB-like query interface for IndexedDB
- Strong TypeScript support with full type inference
- Reactive state management for real-time UI updates
- Support for complex CRUD operations and advanced querying
- Flexible data modeling with automatic schema creation
- Built-in indexing and optimization features
- Easy integration with front-end frameworks, especially Svelte
- Robust error handling and logging
- Versioning and database migration support
- Support for svelte 5 state

## Installation

```bash
npm install @medyll/idae-idbql
```

## Quick Start

```typescript
import { createIdbqDb } from '@medyll/idae-idbql';

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

### createIdbqDb(model, version)

Creates an IndexedDB database instance with the specified model and version.

### idbql

The main interface for database operations. Provides methods for each collection defined in your model.

### idbqlState

A reactive state object that reflects the current state of your database.

### idbDatabase

Provides low-level access to the IndexedDB instance.

### idbqModel

Contains the database model definition.

## Query Operations

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

## Transactions

idbql supports complex transactions across multiple object stores:

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
```

## Reactive State Management

```typescript
import { derived } from 'svelte/store';

const activeUsers = $derived(idbqlState.users.where({ isActive: true }));
```

## Integration with Svelte

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

## Performance Tips

- Use appropriate indexes
- Limit result sets with `.limit(n)`
- Use `.count()` instead of `.toArray().length`
- Optimize queries to use indexes effectively

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
 