## ResultSet.ts

This class `ResultSet` is used to manipulate and iterate over a set of data. The class is iterable, meaning it can be spread into an array or iterated over with a `for...of` loop.

### Methods

#### constructor(data: T[])

- Action: Initializes the `ResultSet` with an array of data and an `ObservableStore` with the same data.
- Arguments: An array of data of type `T`.
- Return: An instance of `ResultSet`.

#### setOptions<T>(options: OptionsType)

- Action: Sets the options for the result set in one pass.
- Arguments: An `OptionsType` object which can contain `sort`, `page`, and `groupBy` properties.
  - `sort`: An object where the keys represent the properties to sort by, and the values represent the sort order ("asc" for ascending, "desc" for descending).
  - `page`: An object with `size` and `number` properties, representing the number of items per page and the page number to retrieve, respectively.
  - `groupBy`: A string or an array of strings, representing the field names to group by.
- Return: The updated result set.

#### observe()

- Action: Returns the `ObservableStore` for the result set.
- Arguments: None.
- Return: The `ObservableStore` for the result set.

#### sortBy(args: Record<string, "asc" | "desc">)

- Action: Sorts the data in the result set based on the provided sorting criteria.
- Arguments: An object where the keys represent the properties to sort by, and the values represent the sort order ("asc" for ascending, "desc" for descending).
- Return: The sorted result set.

#### getPage(size: number, page: number)

- Action: Retrieves a specific page of data from the result set.
- Arguments: The `size` parameter specifies the number of items per page, and the `page` parameter specifies the page number to retrieve.
- Return: A new result set containing the specified page of data.

#### groupBy(fieldName: string | string[], transform?: (value: any) => void)

- Action: Groups the result set by the specified field name(s).
- Arguments: The `fieldName` parameter can be a string or an array of strings, representing the field names to group by. The `transform` parameter is an optional transformation function to apply to each grouped value.
- Return: An object representing the grouped result set.

### Iterability

The `ResultSet` class is iterable, meaning it can be spread into an array or iterated over with a `for...of` loop. This is achieved by implementing the `[Symbol.iterator]` method.
