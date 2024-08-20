
# @medyll/idae-db

@medyll/idae-db is a flexible and powerful library for interacting with various databases, with a particular focus on MongoDB support.

## Installation

```bash
npm install @medyll/idae-db
```

## Key Features

- Robust support for MongoDB
- Unified interface for different types of databases
- Efficient connection management
- Intuitive and flexible API

## Quick Start with MongoDB

```typescript
import { IdaeDb, DbType } from '@medyll/idae-db';

async function main() {
  // Initialize MongoDB connection
  const mongoDb = IdaeDb.init('mongodb://localhost:27017', {
    dbType: DbType.MONGODB,
    dbScope: 'myapp_'
  });

  // Create a connection
  await mongoDb.db('example_db');

  // Use the 'users' collection
  const usersCollection = mongoDb.collection('users');

  // Insert a document
  await usersCollection.update('user1', {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });

  // Find a document
  const user = await usersCollection.findOne({ query: { email: 'john@example.com' } });
  console.log('Found user:', user);

  // Close the connection
  await mongoDb.closeConnection();
}

main().catch(console.error);
```

## MongoDB Features

- Easy creation and management of connections
- Simplified CRUD operations
- Support for complex queries
- Index management
- Transactions (coming soon)

## Advanced Configuration

```typescript
const mongoDb = IdaeDb.init('mongodb://localhost:27017', {
  dbType: DbType.MONGODB,
  dbScope: 'myapp_',
  dbScopeSeparator: '_',
  idaeModelOptions: {
    // Model-specific options
  }
});
```

## MongoDB API

- `collection(name: string)`: Access a MongoDB collection
- `find(params)`: Search for documents
- `findOne(params)`: Find a single document
- `update(id, data)`: Update a document
- `deleteById(id)`: Delete a document by ID
- `createIndex(fieldOrSpec, options)`: Create an index on the collection

## Connection Management

- Efficiently managed multiple connections
- Automatic closure of connections

## Roadmap

- Enhanced support for other databases (MySQL, ChromaDB)
- Advanced features for MongoDB (aggregations, watch)
- Performance optimizations

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

MIT
