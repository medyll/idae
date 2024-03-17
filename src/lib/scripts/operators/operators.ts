import { type Operator, type OperatorType, type Where } from "../types.js";

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

  static #operatorsFunctions: Record<
    keyof OperatorType,
    (fieldName: any, value: any, data: any) => boolean
  > = {
    eq: this.#equalityComparison,
    gt: this.#greaterThanComparison,
    gte: this.#greaterThanOrEqualComparison,
    in: this.#inclusionComparison,
    nin: this.#exclusionComparison,
    lt: this.#lessThanComparison,
    lte: this.#lessThanOrEqualComparison,
    ne: this.#notEqualComparison,
    contains: this.#containsComparison,
    startsWith: this.#startsWithComparison,
    endsWith: this.#endsWithComparison,
  };

  static parse<T>(data: T[], qy: Where<T>) {
    let dta: T[];
    for (const fieldName in qy) {
      const query = qy[fieldName];
      if (
        typeof query === "object" &&
        Operators.operators.includes(Object.keys(query)[0] as Operator)
      ) {
        for (const key in query) {
          // if operator
          if (Operators.operators.includes(key as Operator)) {
            const operator = key as Operator;
            const value = query[key as Operator];

            dta = this.filters(fieldName, operator, value, data);
          } else {
          }
        }
      } else {
        dta = data.filter((dt) => dt[fieldName] == query);
      }
    }

    return dta;
  }
  static filters<F = Record<string, any>>(
    fieldName: keyof F,
    operator: keyof OperatorType,
    value: OperatorType[typeof operator],
    data: F[]
  ) {
    return data.filter((dta) =>
      this.#operatorsFunctions[operator](fieldName, value, dta)
    );
  }

  static #equalityComparison<T>(fieldName: keyof T, value: any, data: T) {
    /* const valueStr = value.toString();
    const startsWith = valueStr.startsWith("*");
    const endsWith = valueStr.endsWith("*");

    if (startsWith && endsWith) {
      return data[fieldName]?.toString().includes(valueStr.slice(1, -1));
    } else if (startsWith) {
      return data[fieldName]?.toString().startsWith(valueStr.slice(1));
    } else if (endsWith) {
      return data[fieldName]?.toString().endsWith(valueStr.slice(0, -1));
    } */
    return data[fieldName] === value;
  }

  static #greaterThanComparison<T>(fieldName: keyof T, value: any, data: T) {
    return value < data[fieldName];
  }

  static #greaterThanOrEqualComparison<T>(
    fieldName: keyof T,
    value: any,
    data: T
  ) {
    return value <= data[fieldName];
  }

  static #inclusionComparison<T>(fieldName: keyof T, value: any[], data: T) {
    return value.includes(data[fieldName]);
  }

  static #exclusionComparison<T>(fieldName: keyof T, value: any[], data: T) {
    return !value.includes(data[fieldName]);
  }

  static #lessThanComparison<T>(fieldName: keyof T, value: any, data: T) {
    return value > data[fieldName];
  }

  static #lessThanOrEqualComparison<T>(
    fieldName: keyof T,
    value: any[],
    data: T
  ) {
    return value >= data[fieldName];
  }

  static #notEqualComparison<T>(fieldName: keyof T, value: any[], data: T) {
    return value !== data[fieldName];
  }

  static #containsComparison<T>(fieldName: keyof T, value: any, data: T) {
    return `${data[fieldName]}`.includes(value);
  }

  static #startsWithComparison<T>(fieldName: keyof T, value: any, data: T) {
    return `${data[fieldName]}`.startsWith(value);
  }

  static #endsWithComparison<T>(fieldName: keyof T, value: any, data: T) {
    return `${data[fieldName]}`.endsWith(value);
  }
}
