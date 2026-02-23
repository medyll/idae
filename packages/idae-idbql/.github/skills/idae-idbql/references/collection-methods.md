# Collection Methods

Each collection (e.g., `idbql.users`, `idbql.tasks`) exposes standard CRUD and query methods.

## Reading Data
- `where(query, options?)`: Advanced filtering with operator support.
- `get(id, pathKey?)`: Get a single item by key.
- `getBy(value, pathKey?)`: Get all items matching a key/value pair.
- `getAll()`: Get all items in the collection.
- `count(query?)`: Count documents, optionally filtered.

## Writing Data
- `put(data)`: Insert or update an item.
- `add(data)`: Insert a new item.
- `update(id, changes)`: Update an item by key.
- `updateWhere(query, changes)`: Bulk update items matching a query.

## Deleting Data
- `delete(id)`: Delete an item by key.
- `deleteWhere(query)`: Bulk delete items matching a query.