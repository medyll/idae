/**
 * Query Operators supported by Qoolie (via idae-query)
 * 
 * These operators can be used in where() queries:
 * 
 * @example
 * ```typescript
 * // Equality
 * qoolie.users.where({ age: { $eq: 18 } })
 * 
 * // Comparison
 * qoolie.users.where({ age: { $gt: 18 } })
 * qoolie.users.where({ age: { $gte: 18 } })
 * qoolie.users.where({ age: { $lt: 18 } })
 * qoolie.users.where({ age: { $lte: 18 } })
 * 
 * // Not equal
 * qoolie.users.where({ status: { $ne: 'inactive' } })
 * 
 * // Inclusion
 * qoolie.users.where({ role: { $in: ['admin', 'moderator'] } })
 * qoolie.users.where({ role: { $nin: ['banned', 'suspended'] } })
 * 
 * // String matching
 * qoolie.users.where({ name: { $contains: 'john' } })
 * qoolie.users.where({ name: { $startsWith: 'J' } })
 * qoolie.users.where({ name: { $endsWith: 'n' } })
 * 
 * // Range (between)
 * qoolie.users.where({ age: { $btw: [18, 65] } })
 * ```
 */

export type OperatorType<T = unknown> = {
  /** Equal to */
  $eq?: T;
  /** Greater than (numbers or dates) */
  $gt?: T extends number | Date ? T : never;
  /** Greater than or equal to (numbers or dates) */
  $gte?: T extends number | Date ? T : never;
  /** Less than (numbers or dates) */
  $lt?: T extends number | Date ? T : never;
  /** Less than or equal to (numbers or dates) */
  $lte?: T extends number | Date ? T : never;
  /** Not equal to */
  $ne?: T;
  /** In array */
  $in?: T[];
  /** Not in array */
  $nin?: T[];
  /** Contains substring (strings only) */
  $contains?: T extends string ? string : never;
  /** Starts with (strings only) */
  $startsWith?: T extends string ? string : never;
  /** Ends with (strings only) */
  $endsWith?: T extends string ? string : never;
  /** Between two numbers (numbers only) */
  $btw?: T extends number ? [T, T] : never;
};

/**
 * Where query type for Qoolie
 */
export type Where<T = Record<string, unknown>> = {
  [K in keyof T]?: T[K] | Partial<OperatorType<T[K]>>;
};

/**
 * List of all supported operators
 */
export const SUPPORTED_OPERATORS = [
  '$eq',
  '$gt',
  '$gte',
  '$lt',
  '$lte',
  '$ne',
  '$in',
  '$nin',
  '$contains',
  '$startsWith',
  '$endsWith',
  '$btw',
] as const;

export type SupportedOperator = typeof SUPPORTED_OPERATORS[number];
