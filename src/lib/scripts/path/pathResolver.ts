export type DotPath<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends null | undefined
        ? K & string
        : `${K & string}${"" extends DotPath<T[K]> ? "" : "."}${DotPath<T[K]>}`;
    }[keyof T]
  : "";

/**
 * Resolves a dot path on an object and returns the value at that path.
 * If the path does not exist, it returns the defaultValue.
 *
 * @template T - The type of the value to be returned.
 * @param object - The object to resolve the path on.
 * @param path - The dot path to resolve.
 * @param defaultValue - The default value to return if the path does not exist. (optional)
 * @returns The value at the specified path, or the defaultValue if the path does not exist.
 */
export function dotPath<T = unknown>(
  object: Record<string, any>,
  path: string,
  defaultValue?: any
): T {
  return (path.split(".").reduce((r, s) => (r ? r[s] : defaultValue), object) ??
    defaultValue) as T;
}
