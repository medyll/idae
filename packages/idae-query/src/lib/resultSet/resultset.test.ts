import { describe, beforeEach, it, expect } from "vitest";
import { getResultSet } from "./resultset.js";

describe("getResultSet", () => {
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
    expect(result).toBe(resultSet);
    expect(resultSet[0].age).toBe(25);
    expect(resultSet[resultSet.length - 1].age).toBe(40);
  });

  it("should set options and apply sorting descending", () => {
    const resultSet = getResultSet(data);
    const options = { sort: { age: "desc" } };
    const result = resultSet.setOptions(options);
    expect(result).toBe(resultSet);
    expect(resultSet[0].age).toBe(40);
    expect(resultSet[resultSet.length - 1].age).toBe(25);
  });

  it("should set options and apply grouping", () => {
    const resultSet = getResultSet(data);
    const options = { groupBy: "age" };
    const result = resultSet.setOptions(options);
    expect(result).toHaveProperty("25");
    expect(result[25].data).toHaveLength(1);
  });

  it("should sort the data in ascending order", () => {
    const resultSet = getResultSet(data);
    const sortedData = resultSet.sortBy({ age: "desc" });
    expect(sortedData[0].age).toBe(40);
    expect(sortedData[sortedData.length - 1].age).toBe(25);
  });

  it("should group the data by a single field", () => {
    const resultSet = getResultSet(data);
    const groupedData = resultSet.groupBy("age");
    expect(groupedData).toHaveProperty("25");
    expect(groupedData[25].data).toHaveLength(1);
  });

  it("should get the specified page of data", () => {
    const resultSet = getResultSet(data);
    const pageData = resultSet.getPage(2, 2);
    expect(pageData).toHaveLength(2);
  });

  describe("filter method", () => {
    it("should filter items by predicate", () => {
      const resultSet = getResultSet(data);
      const filtered = resultSet.filter((item) => item.age > 30);
      expect(filtered.length).toBe(2);
      expect(filtered[0].name).toBe("Alice");
      expect(filtered[1].name).toBe("Bob");
    });

    it("should filter and return chainable ResultSet", () => {
      const resultSet = getResultSet(data);
      const filtered = resultSet.filter((item) => item.age > 30).sortBy({ name: "asc" });
      expect(filtered.length).toBe(2);
      expect(typeof filtered.sortBy).toBe("function");
    });

    it("should return empty array when no items match", () => {
      const resultSet = getResultSet(data);
      const filtered = resultSet.filter((item) => item.age > 100);
      expect(filtered.length).toBe(0);
    });
  });

  describe("map method", () => {
    it("should map items to new structure", () => {
      const resultSet = getResultSet(data);
      const mapped = resultSet.map((item) => ({ name: item.name, older: item.age + 10 }));
      expect(mapped.length).toBe(4);
      expect(mapped[0].name).toBe("Alice");
      expect(mapped[0].older).toBe(50);
    });

    it("should map and return chainable ResultSet", () => {
      const resultSet = getResultSet(data);
      const mapped = resultSet.map((item) => ({ name: item.name }));
      expect(typeof mapped.sortBy).toBe("function");
    });
  });

  describe("distinct method", () => {
    it("should remove duplicates by entire object", () => {
      // Note: distinct by object reference, not deep equality
      const obj1 = { id: 1, name: "John" };
      const obj2 = { id: 1, name: "John" };
      const obj3 = { id: 2, name: "Jane" };
      const dataWithDupes = [obj1, obj1, obj3]; // Same reference twice
      const resultSet = getResultSet(dataWithDupes);
      const distinct = resultSet.distinct();
      expect(distinct.length).toBe(2);
    });

    it("should remove duplicates by key", () => {
      const resultSet = getResultSet(data);
      const dataWithDupes = [
        ...data,
        { id: 4, name: "Alice2", age: 40, metadata: { order: 4 } },
      ];
      const resultSetDupe = getResultSet(dataWithDupes);
      const distinct = resultSetDupe.distinct("age");
      expect(distinct.length).toBe(4);
    });

    it("should support dot-path for distinct", () => {
      const dataWithDupes = [
        { id: 1, metadata: { order: 1 } },
        { id: 2, metadata: { order: 2 } },
        { id: 3, metadata: { order: 1 } },
      ];
      const resultSet = getResultSet(dataWithDupes);
      const distinct = resultSet.distinct("metadata.order");
      expect(distinct.length).toBe(2);
    });
  });

  describe("reverse method", () => {
    it("should reverse the order of items", () => {
      const resultSet = getResultSet(data);
      const reversed = resultSet.reverse();
      expect(reversed.length).toBe(4);
      expect(reversed[0].id).toBe(3);
      expect(reversed[3].id).toBe(4);
    });

    it("should reverse and return chainable ResultSet", () => {
      const resultSet = getResultSet(data);
      const reversed = resultSet.reverse().sortBy({ name: "asc" });
      expect(typeof reversed.sortBy).toBe("function");
    });
  });

  describe("sum method", () => {
    it("should sum numeric field values", () => {
      const resultSet = getResultSet(data);
      const sum = resultSet.sum("age");
      expect(sum).toBe(130); // 40 + 30 + 25 + 35
    });

    it("should support dot-path for sum", () => {
      const dataWithNested = [
        { price: 100, discount: { amount: 10 } },
        { price: 200, discount: { amount: 20 } },
      ];
      const resultSet = getResultSet(dataWithNested);
      const sum = resultSet.sum("discount.amount");
      expect(sum).toBe(30);
    });

    it("should return 0 for empty array", () => {
      const resultSet = getResultSet([]);
      const sum = resultSet.sum("age");
      expect(sum).toBe(0);
    });

    it("should throw TypeError for non-numeric field", () => {
      const resultSet = getResultSet(data);
      expect(() => resultSet.sum("name")).toThrow(TypeError);
    });
  });

  describe("avg method", () => {
    it("should calculate average of numeric field values", () => {
      const resultSet = getResultSet(data);
      const avg = resultSet.avg("age");
      expect(avg).toBe(32.5); // 130 / 4
    });

    it("should return 0 for empty array", () => {
      const resultSet = getResultSet([]);
      const avg = resultSet.avg("age");
      expect(avg).toBe(0);
    });
  });

  describe("min method", () => {
    it("should return minimum numeric value", () => {
      const resultSet = getResultSet(data);
      const min = resultSet.min("age");
      expect(min).toBe(25);
    });

    it("should support dot-path for min", () => {
      const dataWithNested = [
        { price: 100, discount: { amount: 10 } },
        { price: 200, discount: { amount: 5 } },
      ];
      const resultSet = getResultSet(dataWithNested);
      const min = resultSet.min("discount.amount");
      expect(min).toBe(5);
    });

    it("should return Infinity for empty array", () => {
      const resultSet = getResultSet([]);
      const min = resultSet.min("age");
      expect(!Number.isFinite(min)).toBe(true);
    });

    it("should throw TypeError for non-numeric field", () => {
      const resultSet = getResultSet(data);
      expect(() => resultSet.min("name")).toThrow(TypeError);
    });
  });

  describe("max method", () => {
    it("should return maximum numeric value", () => {
      const resultSet = getResultSet(data);
      const max = resultSet.max("age");
      expect(max).toBe(40);
    });

    it("should return -Infinity for empty array", () => {
      const resultSet = getResultSet([]);
      const max = resultSet.max("age");
      expect(!Number.isFinite(max)).toBe(true);
    });
  });

  describe("count method", () => {
    it("should count all items without criteria", () => {
      const resultSet = getResultSet(data);
      const count = resultSet.count();
      expect(count).toBe(4);
    });

    it("should count items matching criteria", () => {
      const resultSet = getResultSet(data);
      const count = resultSet.count({ age: { gt: 30 } });
      expect(count).toBe(2);
    });

    it("should return 0 for empty array", () => {
      const resultSet = getResultSet([]);
      const count = resultSet.count();
      expect(count).toBe(0);
    });
  });

  describe("pluck method", () => {
    it("should extract values of a field", () => {
      const resultSet = getResultSet(data);
      const plucked = resultSet.pluck("name");
      expect(plucked).toHaveLength(4);
      expect(plucked[0]).toBe("Alice");
      expect(plucked[1]).toBe("Jane");
    });

    it("should support dot-path for pluck", () => {
      const resultSet = getResultSet(data);
      const plucked = resultSet.pluck("metadata.order");
      expect(plucked).toHaveLength(4);
      expect(plucked[0]).toBe(4);
    });

    it("should return empty array for empty data", () => {
      const resultSet = getResultSet([]);
      const plucked = resultSet.pluck("name");
      expect(plucked).toHaveLength(0);
    });
  });

  describe("reduce method", () => {
    it("should reduce to a single value", () => {
      const resultSet = getResultSet(data);
      const result = resultSet.reduce((acc, item) => acc + item.age, 0);
      expect(result).toBe(130);
    });

    it("should reduce to an object", () => {
      const resultSet = getResultSet(data);
      const result = resultSet.reduce(
        (acc, item) => {
          acc[item.name] = item.age;
          return acc;
        },
        {} as Record<string, number>
      );
      expect(result.Alice).toBe(40);
      expect(result.Jane).toBe(30);
    });
  });

  describe("first method", () => {
    it("should return first item", () => {
      const resultSet = getResultSet(data);
      const first = resultSet.first();
      expect(first?.id).toBe(4);
    });

    it("should return undefined for empty array", () => {
      const resultSet = getResultSet([]);
      const first = resultSet.first();
      expect(first).toBeUndefined();
    });
  });

  describe("last method", () => {
    it("should return last item", () => {
      const resultSet = getResultSet(data);
      const last = resultSet.last();
      expect(last?.id).toBe(3);
    });

    it("should return undefined for empty array", () => {
      const resultSet = getResultSet([]);
      const last = resultSet.last();
      expect(last).toBeUndefined();
    });
  });

  describe("method chaining", () => {
    it("should chain filter -> sortBy -> pluck", () => {
      const resultSet = getResultSet(data);
      const result = resultSet
        .filter((item) => item.age > 25)
        .sortBy({ age: "asc" })
        .pluck("name");
      expect(result).toHaveLength(3);
      expect(result[0]).toBe("Jane");
    });

    it("should chain distinct -> reverse -> first", () => {
      const resultSet = getResultSet(data);
      const first = resultSet
        .distinct("id")
        .reverse()
        .first();
      expect(first?.name).toBe("Bob");
    });
  });
});
