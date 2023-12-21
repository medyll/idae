

# idbq: an IndexedDB wrapper

This project is a library for interacting with IndexedDB in the browser. It provides a simple interface for creating, reading, updating, and deleting data in an IndexedDB database.

## Installation

You can install this library using npm:

```bash
npm install idbq
```

## Classes

### DataBase

The `DataBase` class extends `Idbq` and defines three collections: `chat`, `messages`, and `stream`. The syntax for defining collections is as follows:

- `&`: Indicates that the field is an index. Indexed fields can be used for faster searching.
- `++`: Indicates that the field is an auto-incrementing primary key.

```typescript
export class DataBase extends Idbq {
  chat!: Collection<Collection1>;
  messages!: Collection<Collection2>;

  constructor() {
    super("myDatabase");

    this.version(2).stores({
      chat: "&chatId, created_at, dateLastMessage",
      messages: "++id, chatId, created_at",
      stream: "++id, messageId, created_at, done",
    });
  }
}
```

### Operators

The `Operators` class provides a set of comparison operators for filtering data:

- `eq`: Equality comparison
- `gt`: Greater than comparison
- `gte`: Greater than or equal to comparison
- `lt`: Less than comparison
- `lte`: Less than or equal to comparison
- `ne`: Not equal comparison
- `in`: Inclusion in a list comparison
- `nin`: Exclusion from a list comparison
- `contains`: Checks if a value is contained in a field
- `startsWith`: Checks if a field starts with a value
- `endsWith`: Checks if a field ends with a value

## Usage

To use this library, create a new instance of `DataBase`:

```typescript
export const dbase2 = new DataBase();
```

You can then use `dbase2` to interact with your IndexedDB database.

## Testing

The tests for this library are located in the `/tests` directory. To run the tests, use the following command:

```bash
npm run test
```

This will run all the tests and display the results in your terminal.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.