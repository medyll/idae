import { dataOp, type DataGroupResult } from "./dataOp.js";
import { describe, it, expect } from "vitest";

describe("dataOp", () => {
  describe("do", () => {
    const arr = [
      { id: 3, name: "John" },
      { id: 1, name: "Jane" },
      { id: 2, name: "John Doe" },
    ];

    it("should perform sorting, finding, and grouping operations on data", () => {
      const result = dataOp.do({
        sort: { arr, by: "id", sort: "asc" },
        find: { kw: "John", arr, field: "name" },
        group: { dataList: arr, groupBy: "name" },
      });

      expect(result).toEqual({
        John: { title: "John", code: "John", data: [{ id: 3, name: "John" }] },
        "John Doe": {
          title: "John Doe",
          code: "John Doe",
          data: [{ id: 2, name: "John Doe" }],
        },
      });
    });

    it("should return the sorted array if no find or group options are provided", () => {
      const result = dataOp.do({
        sort: { arr, by: "id", sort: "asc" },
      });

      expect(result).toEqual([
        { id: 1, name: "Jane" },
        { id: 2, name: "John Doe" },
        { id: 3, name: "John" },
      ]);
    });

    it("should return the found array if no sort or group options are provided", () => {
      const result = dataOp.do({
        find: { kw: "John", arr, field: "name" },
      });

      expect(result).toEqual([
        { id: 3, name: "John" },
        { id: 2, name: "John Doe" },
      ]);
    });

    it("should return the grouped data if no sort or find options are provided", () => {
      const result = dataOp.do({
        group: { dataList: arr, groupBy: "name" },
      });

      expect(result).toEqual({
        Jane: { title: "Jane", code: "Jane", data: [{ id: 1, name: "Jane" }] },
        "John Doe": {
          title: "John Doe",
          code: "John Doe",
          data: [{ id: 2, name: "John Doe" }],
        },
        John: { title: "John", code: "John", data: [{ id: 3, name: "John" }] },
      });
    });

    it("should return an empty array if no options are provided", () => {
      const result = dataOp.do({});

      expect(result).toEqual([]);
    });

    it("should handle complex sorting with multiple fields", () => {
      const complexArr = [
        { id: 1, name: "John", age: 30 },
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "John", age: 35 },
      ];

      const result = dataOp.do({
        sort: {
          arr: complexArr,
          by: { name: "asc", age: "desc" },
        },
      });

      expect(result).toEqual([
        { id: 2, name: "Jane", age: 25 },
        { id: 3, name: "John", age: 35 },
        { id: 1, name: "John", age: 30 },
      ]);
    });
  });
  describe("sortBy", () => {
    it("should sort array of objects by a specified field", () => {
      const arr = [{ id: 3 }, { id: 1 }, { id: 2 }];
      const sortedArr = dataOp.sortBy({ arr, by: "id", sort: "asc" });
      expect(sortedArr).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
    it("should not sort array of objects by a specified field", () => {
      const arr = [{ id: 3 }, { id: 1 }, { id: 2 }];
      const sortedArr = dataOp.sortBy({ arr, by: "id" });
      expect(sortedArr).toEqual([{ id: 3 }, { id: 1 }, { id: 2 }]);
    });
  });

  describe("find", () => {
    it("should find objects in an array based on specified criteria", () => {
      const arr = [{ name: "John" }, { name: "Jane" }, { name: "John Doe" }];
      const result = dataOp.find({ kw: "John", arr, field: "name" });
      expect(result).toEqual([{ name: "John" }, { name: "John Doe" }]);
    });

    it("should perform case-insensitive search when caseSensitive is false", () => {
      const arr = [{ name: "John" }, { name: "Jane" }, { name: "john doe" }];
      const result = dataOp.find({
        kw: "JOHN",
        arr,
        field: "name",
        caseSensitive: false,
      });
      expect(result).toEqual([{ name: "John" }, { name: "john doe" }]);
    });

    it('should search in all fields when field is "*"', () => {
      const arr = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];
      const result = dataOp.find({ kw: "30", arr, field: "*" });
      expect(result).toEqual([{ name: "John", age: 30 }]);
    });
  });

  describe("findOne", () => {
    it("should find the first object in an array that matches the specified criteria", () => {
      const arr = [{ name: "John" }, { name: "Jane" }, { name: "John Doe" }];
      const result = dataOp.findOne({ kw: "John", arr, field: "name" });
      expect(result).toEqual({ name: "John" });
    });

    it("should perform case-insensitive search when caseSensitive is false", () => {
      const arr = [{ name: "John" }, { name: "Jane" }, { name: "john doe" }];
      const result = dataOp.findOne({
        kw: "JOHN",
        arr,
        field: "name",
        caseSensitive: false,
      });
      expect(result).toEqual({ name: "John" });
    });

    it('should search in all fields when field is "*"', () => {
      const arr = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
      ];
      const result = dataOp.findOne({ kw: "30", arr, field: "*" });
      expect(result).toEqual({ name: "John", age: 30 });
    });
  });

  describe("groupBy", () => {
    it("should group objects in an array based on specified fields", () => {
      const arr = [
        { id: 1, category: "A" },
        { id: 2, category: "B" },
        { id: 3, category: "A" },
      ];
      const result = dataOp.groupBy({ dataList: arr, groupBy: "category" });
      const expected: DataGroupResult<(typeof arr)[0]> = {
        A: {
          title: "A",
          code: "A",
          data: [
            { id: 1, category: "A" },
            { id: 3, category: "A" },
          ],
        },
        B: { title: "B", code: "B", data: [{ id: 2, category: "B" }] },
      };
      expect(result).toEqual(expected);
    });

    it("should group objects in an array based on a custom grouping function", () => {
      const arr = [
        { id: 1, category: "A" },
        { id: 2, category: "B" },
        { id: 3, category: "A" },
      ];
      const result = dataOp.groupBy({
        dataList: arr,
        groupBy: (item) => ({
          title: item.category,
          code: item.category.toUpperCase(),
        }),
      });
      const expected: DataGroupResult<(typeof arr)[0]> = {
        A: {
          title: "A",
          code: "A",
          data: [
            { id: 1, category: "A" },
            { id: 3, category: "A" },
          ],
        },
        B: { title: "B", code: "B", data: [{ id: 2, category: "B" }] },
      };
      expect(result).toEqual(expected);
    });

    it("should keep ungrouped data when keepUngroupedData is true", () => {
      const arr = [
        { id: 1, category: "category A" },
        { id: 2, category: "category B" },
        { id: 3, category: "category A" },
        { id: 3, no_category: "category A" },
      ];
      const result = dataOp.groupBy({
        dataList: arr,
        groupBy: "category",
        keepUngroupedData: true,
      });

      const expected: DataGroupResult<(typeof arr)[0]> = {
        "category A": {
          title: "category A",
          code: "category A",
          data: [
            { id: 1, category: "category A" },
            { id: 3, category: "category A" },
          ],
        },
        "category B": {
          title: "category B",
          code: "category B",
          data: [{ id: 2, category: "category B" }],
        },
        "- ungrouped": {
          title: "- Ungrouped",
          code: "- ungrouped",
          data: [{ id: 3, no_category: "category A" }],
        },
      };
      expect(result).toEqual(expected);
    });
  });

  describe("findByIndex", () => {
    it("should find the index of an object in an array based on a specified value and key", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const index = dataOp.findByIndex(arr, 2, "id");
      expect(index).toBe(1);
    });

    it("should find the index of an object in an array based on a specified value and dot path", () => {
      const arr = [
        { user: { id: 1 } },
        { user: { id: 2 } },
        { user: { id: 3 } },
      ];
      const index = dataOp.findByIndex(arr, 2, "user.id");
      expect(index).toBe(1);
    });

    it("should return -1 if no match is found", () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const index = dataOp.findByIndex(arr, 4, "id");
      expect(index).toBe(-1);
    });
  });
});
