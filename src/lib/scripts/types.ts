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

export type WhereData<T> = Partial<Record<keyof T, any>>;
export type WhereKeys<T> = Partial<Record<keyof OperatorType, Record<keyof T, any>>>;
export type Where<T> = Partial<WhereData<T> & WhereKeys<T>>;
