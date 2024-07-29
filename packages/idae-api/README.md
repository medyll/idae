# @medyll/idae-api

A flexible and extensible API framework for Node.js, designed to work with multiple database types and configurations.

## Features

- Modular architecture with clear separation of concerns
- Dynamic database connection management
- Flexible routing system
- Support for multiple database types (currently MongoDB, with easy extensibility for others)
- TypeScript support for improved robustness and maintainability

## Installation

```
npm install @medyll/idae-api
```

## Quick Start

```javascript
import { idaeApi } from '@medyll/idae-api';

// Configure the server
idaeApi.setOptions({
  port: 3000,
  enableAuth: false,
  onInUse: 'reboot'
});

// Start the server
idaeApi.start();
```

## Configuration

You can configure the API server using the `setOptions` method:

```javascript
idaeApi.setOptions({
  port: 3000,
  routes: customRoutes,
  enableAuth: true,
  jwtSecret: 'your-secret-key',
  tokenExpiration: '1h',
  onInUse: 'reboot'
});
```

## Custom Routes

You can add custom routes to the API:

```javascript
const customRoutes = [
  {
    method: 'get',
    path: '/custom/hello',
    handler: async () => ({ message: 'Hello from custom route!' }),
    requiresAuth: false
  }
];

idaeApi.router.addRoutes(customRoutes);
```

## Database Adapters

The API currently supports MongoDB out of the box. You can easily extend it to support other databases by implementing the `DatabaseAdapter` interface.

## Error Handling

The API includes built-in error handling middleware. You can customize error handling by modifying the `configureErrorHandling` method in the `IdaeApi` class.

## API Client Usage

The `@medyll/idae-api` package includes a flexible and powerful API client that allows you to interact with your API endpoints easily. Below is a detailed guide on how to use the `IdaeApiClient` and `IdaeApiClientCollection` classes.

### Configuration

First, configure the API client using the `IdaeApiClientConfig` singleton. This configuration will set up the host, port, method, default database, and other options for the client.

```typescript
import { IdaeApiClientConfig } from '@medyll/idae-api';

IdaeApiClientConfig.setOptions({
  host: 'localhost',
  port: 3000,
  method: 'http',
  defaultDb: 'idae_base',
  separator: '//'
});
```

### Creating a Client Instance

Create an instance of the `IdaeApiClient` class to start interacting with your API.

```typescript
import { IdaeApiClient } from '@medyll/idae-api';

const client = new IdaeApiClient();
```

### Interacting with Databases and Collections

You can interact with different databases and collections using the `db` and `collection` methods.

#### Getting the List of Databases

```typescript
async function listDatabases() {
  try {
    const dbList = await client.getDbList();
    console.log('Databases:', dbList);
  } catch (error) {
    console.error('Error fetching database list:', error);
  }
}

listDatabases();
```

#### Getting the List of Collections in a Database

```typescript
async function listCollections(dbName: string) {
  try {
    const collections = await client.getCollections(dbName);
    console.log(`Collections in ${dbName}:`, collections);
  } catch (error) {
    console.error(`Error fetching collections for ${dbName}:`, error);
  }
}

listCollections('idae_base');
```

#### Performing CRUD Operations on a Collection

You can perform CRUD operations on a collection using the `IdaeApiClientCollection` class.

```typescript
async function performCrudOperations() {
  const appConfCollection = client.collection('app_conf');

  try {
    // Create a new document
    const newDoc = await appConfCollection.create({ name: 'Test Config', value: 'Test Value' });
    console.log('Created document:', newDoc);

    // Find all documents
    const allDocs = await appConfCollection.findAll();
    console.log('All documents:', allDocs);

    // Find a specific document by ID
    const foundDoc = await appConfCollection.findById(newDoc._id);
    console.log('Found document:', foundDoc);

    // Update the document
    const updatedDoc = await appConfCollection.update(newDoc._id, { value: 'Updated Value' });
    console.log('Updated document:', updatedDoc);

    // Delete the document
    const deleteResult = await appConfCollection.deleteById(newDoc._id);
    console.log('Deleted document:', deleteResult);
  } catch (error) {
    console.error('Error performing CRUD operations:', error);
  }
}

performCrudOperations();
```

#### Using a Specific Database

You can also specify a database explicitly when working with collections.

```typescript
async function useSpecificDatabase() {
  const appSchemeCollection = client.db('idae_base').collection('appscheme');

  try {
    const appSchemeDocs = await appSchemeCollection.findAll();
    console.log('Documents in appscheme:', appSchemeDocs);
  } catch (error) {
    console.error('Error fetching documents from appscheme:', error);
  }
}

useSpecificDatabase();
```

### Classes and Methods

#### `IdaeApiClient`

- `constructor(clientConfig?: IdaeApiClientConfigCoreOptions & { baseUrl?: string })`
- `getDbList(): Promise<Response>`
- `getCollections(dbName: string): Promise<Response>`
- `db(dbName: string): { collection: (collectionName: string) => IdaeApiClientCollection; getCollections: () => Promise<Response> }`
- `collection(collectionName: string, dbName?: string): IdaeApiClientCollection`

#### `IdaeApiClientCollection`

- `constructor(apiClient: IdaeApiClient, dbName: string, collectionName: string)`
- `findAll<T>(params?: RequestParams): Promise<Response>`
- `findById<T>(id: string): Promise<Response>`
- `create<T>(body: T): Promise<Response>`
- `update<T>(id: string, body: T): Promise<Response>`
- `deleteById<T>(id: string): Promise<Response>`
- `deleteManyByQuery<T>(params: RequestParams): Promise<Response>`

#### `IdaeApiClientConfig`

- `setOptions(options: Partial<IdaeApiClientConfigCoreOptions> | undefined = {}): void`
- `get baseUrl(): string`

#### `IdaeApiClientRequest`

- `constructor(clientConfig: IdaeApiClientConfigCore)`
- `doRequest<T, R = any>(options: RequestOptions<T>): Promise<R>`
- `private buildUrl(params: UrlParams): string`

### Types

- `RequestParams`: `Record<string, unknown>`
- `HttpMethod`: `'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'`
- `RouteNamespace`: `` `methods/${'dbs' | 'collections'}` ``
- `UrlParams`: `{ dbName?: string; collectionName?: string; slug?: string; params?: Record<string, string>; routeNamespace?: RouteNamespace }`
- `RequestOptions<T>`: `UrlParams & { baseUrl?: string; method?: HttpMethod; body?: T; headers?: RequestInit['headers'] }`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
 