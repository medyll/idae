import { describe, it, expect } from "vitest";
import { Operators } from "./operators.js";

describe("Operators.filters", () => {
  const data = [
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 },
  ];

  it('filters with "eq" operator', () => {
    const result = Operators.filters("value", "eq", 20, data);
    expect(result).toEqual([{ id: 2, value: 20 }]);
  });

  it('filters with "gt" operator', () => {
    const result = Operators.filters("value", "gt", 10, data);
    expect(result).toEqual([
      { id: 2, value: 20 },
      { id: 3, value: 30 },
    ]);
  });

  it('filters with "gte" operator', () => {
    const result = Operators.filters("value", "gte", 20, data);
    expect(result).toEqual([
      { id: 2, value: 20 },
      { id: 3, value: 30 },
    ]);
  });

  it('filters with "in" operator', () => {
    const result = Operators.filters("value", "in", [10, 30], data);
    expect(result).toEqual([
      { id: 1, value: 10 },
      { id: 3, value: 30 },
    ]);
  });

  it('filters with "nin" operator', () => {
    const result = Operators.filters("value", "nin", [10, 30], data);
    expect(result).toEqual([{ id: 2, value: 20 }]);
  });

  it('filters with "lt" operator', () => {
    const result = Operators.filters("value", "lt", 30, data);
    expect(result).toEqual([
      { id: 1, value: 10 },
      { id: 2, value: 20 },
    ]);
  });

  it('filters with "lte" operator', () => {
    const result = Operators.filters("value", "lte", 20, data);
    expect(result).toEqual([
      { id: 1, value: 10 },
      { id: 2, value: 20 },
    ]);
  });

  it('filters with "ne" operator', () => {
    const result = Operators.filters("value", "ne", 20, data);
    expect(result).toEqual([
      { id: 1, value: 10 },
      { id: 3, value: 30 },
    ]);
  });

  it('filters with "contains" operator', () => {
    const result = Operators.filters("value", "contains", "0", data);
    expect(result).toEqual([
      { id: 1, value: 10 },
      { id: 2, value: 20 },
      { id: 3, value: 30 },
    ]);
  });

  it('filters with "startsWith" operator', () => {
    const result = Operators.filters("value", "startsWith", "2", data);
    expect(result).toEqual([{ id: 2, value: 20 }]);
  });

  it('filters with "endsWith" operator', () => {
    const result = Operators.filters("value", "endsWith", "0", data);
    expect(result).toEqual([
      { id: 1, value: 10 },
      { id: 2, value: 20 },
      { id: 3, value: 30 },
    ]);
  });
});
