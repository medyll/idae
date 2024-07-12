export type ResolverPathType<T> = T extends object
  ? {
      [K in keyof T]:
        | (K & string)
        | (T[K] extends object
            ? `${K & string}.${ResolverPathType<T[K]>}`
            : never);
    }[keyof T]
  : never;
