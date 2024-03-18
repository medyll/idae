# idbql: a queryable IndexedDB wrapper

**idbql** is a library for interacting with IndexedDB in the browser.  
It provides a **simple interface** for creating, reading, updating, and deleting data in an **IndexedDB** database.  
it provides a **stateful** indexedDB wrapper with a **queryable** interface on top of **svelte 5** : **it's live !**

## Installation

You can install this library using npm:

```bash
npm install idbql
```

## Classes

### DataBase

Define your types

```typescript
export type Chat = {
  id?: number;
  chatId?: string;
  title?: string;
  models?: string[];
};

export type ChatMessage = {
  id?: string;
  chatId: string;
  messageId?: string;
  content?: string;
};
```
- Create your model to define your collections, while preserving typescript features to provide autocomplete features.  
The syntax for defining your model is as follows:

  - `&`: Indicates that the field is an index. Indexed fields can be used for faster searching.
  - `++`: Indicates that the field is an auto-incrementing primary key.  

  ```typescript
  const idbqModel = {
    chat: {
      keyPath: "&chatId, created_at, dateLastMessage",
      model: {} as Chat,
    },
    messages: {
      keyPath: "++id, chatId, created_at",
      model: {} as ChatMessage,
    },
  } as const;
  ```


- Instantiate your database with the model and the version of your database.  

    ```typescript
    const idbq = idbqBase<typeof idbqModel>(idbqModel, 1);  
    export const dbase = idbq("testDatabase");
    ```

## Usage

To use this library, create a new instance of `DataBase`:

  ```typescript
  const idbq = idbqBase<typeof idbqModel>(idbqModel, 1);  
  export const dbase = idbq("testDatabase");
  ```

You can then use `dbase` to interact with your IndexedDB database.

# Collections (Tables)

The collections store your data.  
You can interact with them using the following methods:

## Methods

```typescript
/* The `add()` method adds a new object to the collection. 
It will fail if an object with the same primary key already exists. */ 
dbase.chat.add({ chatId: 5, title: "name" });

/* The `put()` method adds a new object to the collection or updates an existing object. If an object with the same primary key already exists, it will be updated with the new values. */
dbase.chat.put({ chatId: 5, context: [121, 253] });

/* The `get()` method retrieves an object from the collection by its primary key. */
dbase.chat.get(5);
dbase.chat.getOne(5);

/* The `getAll()` method retrieves all objects from the collection. */
dbase.chat.getAll();

/* The `delete()` method removes an object from the collection by its primary key. */
dbase.chat.delete(5);
dbase.chat.deleteWhere({ chatId: 5, title: "name" });

/* The `clear()` method removes all objects from the collection. */
dbase.chat.clear();

/* The `count()` method returns the number of objects in the collection. */
dbase.chat.count();
```

### where(query: object)

The `where()` method filters the collection based on a set of criteria. The method takes an object as a parameter, where each key is a field name and the value is another object specifying the operator and value to filter by.

```typescript
dbase.chat.where({ chatId: { eq: 5 } });
```

These methods provide a simple and intuitive interface for interacting with your IndexedDB database.

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

## Testing

The tests for this library are located in the `/tests` directory. To run the tests, use the following command:

```bash
npm run test
```

This will run all the tests and display the results in your terminal.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
