import { type OperatorType } from "./types.js";

export class Operators {
  static operators: (keyof OperatorType)[] = [
    "eq",
    "gt",
    "gte",
    "lt",
    "lte",
    "ne",
    "in",
    "nin",
    "contains",
    "startsWith",
    "endsWith",
  ];

  private static operatorsFunctions: Record<
    keyof OperatorType,
    (fieldName: any, value: any, data: any) => boolean
  > = {
    eq: this.equalityComparison,
    gt: this.greaterThanComparison,
    gte: this.greaterThanOrEqualComparison,
    in: this.inclusionComparison,
    nin: this.exclusionComparison,
    lt: this.lessThanComparison,
    lte: this.lessThanOrEqualComparison,
    ne: this.notEqualComparison,
    contains: this.containsComparison,
    startsWith: this.startsWithComparison,
    endsWith: this.endsWithComparison,
  };

  static filters<F = Record<string, any>>(
    fieldName: keyof F,
    operator: keyof OperatorType,
    value: OperatorType[typeof operator],
    data: F[]
  ) {
    return data.filter((dta) =>
      this.operatorsFunctions[operator](fieldName, value, dta)
    );
  }

  static equalityComparison<T>(fieldName: keyof T, value: any, data: T) {
    return data[fieldName] === value;
  }

  static greaterThanComparison<T>(fieldName: keyof T, value: any, data: T) {
    return value < data[fieldName];
  }

  static greaterThanOrEqualComparison<T>(
    fieldName: keyof T,
    value: any,
    data: T
  ) {
    return value <= data[fieldName];
  }

  static inclusionComparison<T>(fieldName: keyof T, value: any[], data: T) {
    return value.includes(data[fieldName]);
  }

  static exclusionComparison<T>(fieldName: keyof T, value: any[], data: T) {
    return !value.includes(data[fieldName]);
  }

  static lessThanComparison<T>(fieldName: keyof T, value: any, data: T) {
    return value > data[fieldName];
  }

  static lessThanOrEqualComparison<T>(
    fieldName: keyof T,
    value: any[],
    data: T
  ) {
    return value >= data[fieldName];
  }

  static notEqualComparison<T>(fieldName: keyof T, value: any[], data: T) {
    return value !== data[fieldName];
  }

  static containsComparison<T>(fieldName: keyof T, value: any, data: T) {
    return data[fieldName].includes(value);
  }

  static startsWithComparison<T>(fieldName: keyof T, value: any, data: T) {
    return data[fieldName].startsWith(value);
  }

  static endsWithComparison<T>(fieldName: keyof T, value: any, data: T) {
    return data[fieldName].endsWith(value);
  }
}
