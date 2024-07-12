# @medyll/engine

A powerful TypeScript library for data manipulation and operations across the idae-engine.

## Installation

Install the package using npm:

```bash
npm install @medyll/idae-engine
```

Or using yarn:

```bash
yarn add @medyll/idae-engine
```

## Usage

The `@medyll/idae-eengine` package contains several utility classes. This section focuses on the `dataOp` class, which provides various data manipulation methods.

### Importing

```typescript
import { dataOp } from '@medyll/idae-engine';
```
## dataOp
### Methods

#### do

Performs a combination of sort, find, and group operations on data.

```typescript
const result = dataOp.do({
  sort: { arr: myArray, by: 'fieldName', sort: 'asc' },
  find: { arr: myArray, kw: 'searchTerm', field: 'fieldName' },
  group: { dataList: myArray, groupBy: 'fieldName' }
});
```

#### sortBy

Sorts an array of objects based on specified fields.

```typescript
const sortedArray = dataOp.sortBy({
  arr: myArray,
  by: 'fieldName',
  sort: 'asc'
});
```

#### find

Searches for objects in an array based on specified criteria.

```typescript
const foundItems = dataOp.find({
  arr: myArray,
  kw: 'searchTerm',
  field: 'fieldName'
});
```

#### findOne

Searches for the first object in an array that matches the specified criteria.

```typescript
const foundItem = dataOp.findOne({
  arr: myArray,
  kw: 'searchTerm',
  field: 'fieldName'
});
```

#### groupBy

Groups objects in an array based on specified fields or a custom grouping function.

```typescript
const groupedData = dataOp.groupBy({
  dataList: myArray,
  groupBy: 'fieldName'
});
```

#### findByIndex

Finds the index of an object in an array based on a specified key-value pair.

```typescript
const index = dataOp.findByIndex(myArray, 'value', 'keyName');
```

#### resolveDotPath

Resolves a dot-notated path in an object.

```typescript
const value = dataOp.resolveDotPath(myObject, 'path.to.property');
```

### Testing

The `dataOp` class comes with a comprehensive test suite. To run the tests:

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Run tests: `npm test` or `yarn test`

The tests cover various scenarios for each method, ensuring the reliability and correctness of the `dataOp` class.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.