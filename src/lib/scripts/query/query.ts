import { Operators } from "../operators/operators.js";
import type { Operator, Where } from "../types.js";

export class Query<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = data;
  }

  where(qy: Where<T>) {
    for (const fieldName in qy) {
      const query = qy[fieldName];

      for (const key in query) {
        // if operator
        if (Operators.operators.includes(key as Operator)) {
          const operator = key as Operator;
          const value = query[key as Operator];

          this.data = Operators.filters(fieldName, operator, value, this.data);
        }
      }
    }

    return this.data;
  }
}
