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
    ts: {} as ChatMessage, // this will provide autocompletion
  },
  chat: {
    keyPath: "&chatId, created_at, dateLastMessage",
    ts: {} as Chat,
    template: {
      index:        string;
      presentation: CombineElements<keyof CollectionModel<T>['ts']>;
      fields:       {
        [K in keyof T]: TplFieldRules;
        field1: 'array-of-string';
        field2: 'string (readonly private)';
        field3: 'text-short'
        field4: 'fks-messages.is'
      };
      fks:          {
        [K in TplCollectionName]?: {
          code:     K;
          multiple: boolean;
          rules:    CombinedArgs;
        };
      };
    };
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

// Count all documents in a collection (fast, uses native IndexedDB count)
const totalMessages = await idbql.messages.count();

// Count documents matching a query (retrieves and filters matching documents)
const unreadCount = await idbql.messages.count({ isRead: false });

// Count with complex queries
const recentUnreadCount = await idbql.messages.count({
  isRead: false,
  created_at: { $gt: new Date(Date.now() - 86400000) }
});
```

### Using count() with idbqlState

```typescript
// Reactive count in Svelte 5 components
const unreadMessages = $derived(
  idbqlState.messages.count({ isRead: false })
);

// Count all items (uses native count for optimal performance)
const totalMessages = await idbqlState.messages.count();
```

**Note:** When `count()` is called without parameters, it uses the native IndexedDB count() method for optimal performance. When called with a query parameter, it retrieves all matching documents to return the count.

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


## Svelte 5 Reactivity: Usage & Best Practices

`idbqlState` expose un state réactif Svelte 5 ($state) : toute modification (add, update, delete…) se propage automatiquement à toutes les requêtes (`where`, `groupby`, `sort`, etc.) utilisées dans un `$derived` ou `$effect`.

### Exemple d'usage réactif dans un composant Svelte 5

```svelte
<script lang="ts">
  // Importez idbqlState depuis votre store
  import { idbqlState } from './store';

  // Utilisez $derived pour obtenir une liste réactive
  // Toute modification de la base (ajout, suppression, update) mettra à jour $activeUsers automatiquement
  const activeUsers = $derived(() => idbqlState.users.where({ isActive: true }));
</script>

<h2>Utilisateurs actifs</h2>
{#each $activeUsers as user}
  <p>{user.name}</p>
{/each}
```

### Notes importantes
- Les méthodes `where`, `groupby`, `sort`, etc. sont synchrones : elles opèrent toujours sur le snapshot courant du state.
- Pour bénéficier de la réactivité, utilisez-les dans un `$derived` ou `$effect` Svelte 5.

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
- Use `.count()` instead of `.toArray().length` for counting documents
- When counting all documents, `count()` (without parameters) uses native IndexedDB for optimal performance
- When counting with filters, `count(query)` retrieves matching documents - consider using indexes for better performance
- Optimize queries to use indexes effectively

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
 