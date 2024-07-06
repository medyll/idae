import type { P } from "vitest/dist/reporters-P7C2ytIv.js";

export type Operator = keyof OperatorType;

export type OperatorType = {
  eq?: string | number | Date | boolean | any;
  gt?: number | Date | any;
  gte?: number | Date | any;
  lt?: number | Date | any;
  lte?: number | Date | any;
  ne?: any;
  in?: any[];
  nin?: any[];
  contains?: string;
  startsWith?: string;
  endsWith?: string;
};

export type WhereKeys<T> = Partial<
  Record<keyof OperatorType, Record<keyof T, any>>
>;
export type Where<T> = Partial<
  Record<keyof T, Partial<Record<keyof WhereKeys<T>, any>>>
>;
