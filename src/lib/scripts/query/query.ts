import { svelteState } from "../observable/svelteState.svelte.js";
import { Operators } from "../operators/operators.js";
import { getResultset } from "../resultSet/resultset.js";

import type { Operator, Where } from "../types.js";

export class Query<T> {
  data: T[];
  constructor(data: T[]) {
    this.data = getResultset(data);
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
        console.log(this.data);
        svelteState.dataState[collection] = this.data;
        return getResultset(svelteState.dataState[collection]);
      }
    } catch (e) {
      console.log(e);
    }
    return getResultset(this.data);
  }
}
