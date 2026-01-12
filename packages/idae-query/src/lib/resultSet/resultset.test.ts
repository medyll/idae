import { describe, beforeEach, it, expect } from "vitest";
import { getResultset } from "./resultset.js";

describe("getResultset", () => {
  let data: any[];

  beforeEach(() => {
    data = [
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
    ];
  });

  it("should set options and apply sorting", () => {
    const options = { sort: { age: "asc" } };
    const resultSet = getResultSet(data);
    const result = resultSet.setOptions(options);
    delete resultSet?.groupBy;
    delete resultSet?.setOptions;
    delete resultSet?.sortBy;
    delete resultSet?.getPage;
    expect(result).toBe(resultSet);
    expect(resultSet).toEqual([
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
    ]);
  });

  it("should set options and apply sorting", () => {
    const resultSet = getResultSet(data);
    const options = { sort: { age: "desc" } };
    //@ts-ignore
    const result = resultSet.setOptions(options);
    delete resultSet?.groupBy;
    delete resultSet?.setOptions;
    delete resultSet?.sortBy;
    delete resultSet?.getPage;
    expect(result).toBe(resultSet);
    expect(resultSet).toEqual([
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
    ]);
  });

  it("should set options and apply grouping", () => {
    const resultSet = getResultSet(data);
    const options = { groupBy: "age" };
    const result = resultSet.setOptions(options);
    // expect(result).toBe(resultSet);
    expect(result).toEqual({
      25: {
        code: "25",
        title: "25",
        data: [{ id: 1, name: "John", age: 25, metadata: { order: 1 } }],
      },
      30: {
        code: "30",
        title: "30",
        data: [{ id: 2, name: "Jane", age: 30, metadata: { order: 2 } }],
      },
      35: {
        code: "35",
        title: "35",
        data: [{ id: 3, name: "Bob", age: 35, metadata: { order: 3 } }],
      },
      40: {
        code: "40",
        title: "40",
        data: [{ id: 4, name: "Alice", age: 40, metadata: { order: 4 } }],
      },
    });
  });

  it("should sort the data in ascending order", () => {
    const resultSet = getResultSet(data);
    const sortedData = resultSet.sortBy({ age: "desc" });
    delete sortedData?.groupBy;
    delete sortedData?.setOptions;
    delete sortedData?.sortBy;
    delete sortedData?.getPage;

    expect(sortedData).toEqual([
      { id: 4, name: "Alice", age: 40, metadata: { order: 4 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
      { id: 2, name: "Jane", age: 30, metadata: { order: 2 } },
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
    ]);
  });

  it("should group the data by a single field", () => {
    const resultSet = getResultSet(data);
    const groupedData = resultSet.groupBy("age");
    expect(groupedData).toEqual({
      25: {
        title: "25",
        code: "25",
        data: [{ id: 1, name: "John", age: 25, metadata: { order: 1 } }],
      },
      30: {
        title: "30",
        code: "30",
        data: [{ id: 2, name: "Jane", age: 30, metadata: { order: 2 } }],
      },
      35: {
        title: "35",
        code: "35",
        data: [{ id: 3, name: "Bob", age: 35, metadata: { order: 3 } }],
      },
      40: {
        title: "40",
        code: "40",
        data: [{ id: 4, name: "Alice", age: 40, metadata: { order: 4 } }],
      },
    });
  });

  it("should get the specified page of data", () => {
    const resultSet = getResultSet(data);
    const pageData = resultSet.getPage(2, 2);

    expect(pageData).toEqual([
      { id: 1, name: "John", age: 25, metadata: { order: 1 } },
      { id: 3, name: "Bob", age: 35, metadata: { order: 3 } },
    ]);
  });
});
