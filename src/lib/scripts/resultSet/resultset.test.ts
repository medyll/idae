import { describe, beforeEach, it, expect } from "vitest";
import { getResultset } from "./Resultset.js";

describe("getResultset", () => {
  let data: any[];

  beforeEach(() => {
    data = [
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
    ];
  });

  it("should set options and apply sorting", () => {
    const resultSet = getResultset(data);
    const options = { sort: { age: "asc" } };
    const result = resultSet.setOptions(options);
    expect(result).toBe(resultSet);
    expect(resultSet).toEqual([
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
    ]);
  });

  it("should set options and apply sorting", () => {
    const resultSet = getResultset(data);
    const options = { sort: { age: "desc" } };
    const result = resultSet.setOptions(options);
    expect(result).toBe(resultSet);
    expect(resultSet).toEqual([
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
    ]);
  });

  /*   it("should set options and apply grouping", () => {
    const resultSet = getResultset(data);
    const options = { groupBy: "age" };
    const result = resultSet.setOptions(options);
    expect(result).toBe(resultSet);
    expect(resultSet).toEqual({
      25: [{ id: 1, name: "John", age: 25, metadata: { order: 1 } }],
      30: [{ id: 2, name: "Jane", age: 30, metadata: { order: 2 } }],
      35: [{ id: 3, name: "Bob", age: 35, metadata: { order: 3 } }],
      40: [{ id: 4, name: "Alice", age: 40, metadata: { order: 4 } }],
    });
  }); */

  it("should sort the data in ascending order", () => {
    const resultSet = getResultset(data);
    const sortedData = resultSet.sortBy({ age: "desc" });
    expect(sortedData).toEqual([
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
    ]);
  });

  it("should group the data by a single field", () => {
    const resultSet = getResultset(data);
    const groupedData = resultSet.groupBy("age");
    expect(groupedData).toEqual({
      25: [{ id: 1, name: "John", age: 25, metadata: { order: 1 } }],
      30: [{ id: 2, name: "Jane", age: 30, metadata: { order: 2 } }],
      35: [{ id: 3, name: "Bob", age: 35, metadata: { order: 3 } }],
      40: [{ id: 4, name: "Alice", age: 40, metadata: { order: 4 } }],
    });
  });

  it("should get the specified page of data", () => {
    const resultSet = getResultset(data);
    const pageData = resultSet.getPage(2, 1);
    expect(pageData).toEqual([
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
    ]);
  });
});
