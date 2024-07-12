/* path: D:\boulot\app-node\idbql\src\lib\scripts\types.ts */

export type Operator = keyof OperatorType;

export type OperatorType<T = any> = {
  eq?: T;
  gt?: T extends number | Date ? T : never;
  gte?: T extends number | Date ? T : never;
  lt?: T extends number | Date ? T : never;
  lte?: T extends number | Date ? T : never;
  ne?: T;
  in?: T[];
  nin?: T[];
  contains?: T extends string ? string : never;
  startsWith?: T extends string ? string : never;
  endsWith?: T extends string ? string : never;
  btw?: T extends number ? [T, T] : never;
};

type WhereCondition<T> = {
  [K in keyof T]?: T[K] | Partial<OperatorType<T[K]>>;
};

export type Where<T = Record<string, any>> =
  | WhereCondition<T>
  | { [K in keyof OperatorType]?: Partial<T> };
