import { Operators } from "../operators/operators.js";
import { getResultset } from "../resultSet/Resultset.js";

import type { Operator, Where } from "../types.js";

export class Query<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = data;
    getResultset(this.data ?? []);
  }

  where(qy: Where<T>) {
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

            this.data = Operators.filters(
              fieldName as keyof T,
              operator,
              value,
              this.data
            );
          } else {
          }
        }
      } else {
        this.data = this.data.filter((dt) => dt[fieldName] == query);
      }
    }

    return this.data;
  }

  static whereData<T>(qy: Where<T>, data: T[]) {
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

            data = Operators.filters(
              fieldName as keyof T,
              operator,
              value,
              data
            );
          } else {
          }
        }
      } else {
        data = data.filter((dt) => dt[fieldName] == query);
      }
    }
    getResultset(data);
    return data;
  }
}
