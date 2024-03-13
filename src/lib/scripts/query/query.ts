import { svelteState } from "../observable/svelteState.svelte.js";
import { Operators } from "../operators/operators.js";
import { ResultSet } from "../resultSet/resultset.js";
import type { Operator, Where } from "../types.js";

export class Query<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = data;
  }

  where(qy: Where<T>, collection?: string) {
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
              fieldName,
              operator,
              value,
              this.data
            );
          } else {
            //this.data = this.data.filter((dt) => dt[key] == qy[key]);
          }
        }
      } else {
        this.data = this.data.filter((dt) => dt[fieldName] == query);
      }
    }
    try {
      // put data in svelte state
      if (collection) {
        svelteState.dataState[collection] = this.data;
        return new ResultSet(svelteState.dataState[collection]);
      }
    } catch (e) {
      console.log(e);
    }
    return new ResultSet(this.data);
  }
}
