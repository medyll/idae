import { describe, beforeEach, it, expect } from "vitest";
import { ResultSet } from "./resultset.js";

describe("ResultSet", () => {
  let data: any[];

  beforeEach(() => {
    data = [
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
    ];
  });

  it("should sort the data in ascending order", () => {
    const resultSet = new ResultSet(data);
    const sortedData = resultSet.sortBy({ age: "asc" });
    expect([...sortedData]).toEqual([
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
    ]);
  });

  it("should sort the data by sub key in ascending order", () => {
    const resultSet = new ResultSet(data);
    const sortedData = resultSet.sortBy({ "metadata.order": "asc" });
    expect([...sortedData]).toEqual([
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
    ]);
  });

  it("should sort the data in descending order", () => {
    const resultSet = new ResultSet(data);
    const sortedData = resultSet.sortBy({ age: "desc" });
    expect([...sortedData]).toEqual([
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
    ]);
  });

  it("should sort the data by sub key in descending order", () => {
    const resultSet = new ResultSet(data);
    const sortedData = resultSet.sortBy({ "metadata.order": "desc" });
    expect([...sortedData]).toEqual([
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
    ]);
  });

  it("should get the specified page of data", () => {
    const resultSet = new ResultSet(data);
    const pageData = resultSet.getPage(2, 1);
    expect([...pageData]).toEqual([
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
    ]);
  });

  it("should group the data by a single field", () => {
    const resultSet = new ResultSet(data);
    const groupedData = resultSet.groupBy("age");
    expect(groupedData).toEqual({
      25: [{ id: 1, name: "John", age: 25, metadata: { order: 1 } }],
      30: [{ id: 2, name: "Jane", age: 30, metadata: { order: 2 } }],
      35: [{ id: 3, name: "Bob", age: 35, metadata: { order: 3 } }],
      40: [{ id: 4, name: "Alice", age: 40, metadata: { order: 4 } }],
    });
  });

  it("should group the data by a single field using dot path", () => {
    const resultSet = new ResultSet(data);
    const groupedData = resultSet.groupBy("metadata.order");
    expect(groupedData).toEqual({
      1: [{ id: 1, name: "John", age: 25, metadata: { order: 1 } }],
      2: [{ id: 2, name: "Jane", age: 30, metadata: { order: 2 } }],
      3: [{ id: 3, name: "Bob", age: 35, metadata: { order: 3 } }],
      4: [{ id: 4, name: "Alice", age: 40, metadata: { order: 4 } }],
    });
  });

  it("should group the data by multiple fields", () => {
    const resultSet = new ResultSet(data);
    const groupedData = resultSet.groupBy(["name", "age"]);
    expect(groupedData).toEqual({
      John25: [{ id: 1, name: "John", age: 25, metadata: { order: 1 } }],
      Jane30: [{ id: 2, name: "Jane", age: 30, metadata: { order: 2 } }],
      Bob35: [{ id: 3, name: "Bob", age: 35, metadata: { order: 3 } }],
      Alice40: [{ id: 4, name: "Alice", age: 40, metadata: { order: 4 } }],
    });
  });
});
