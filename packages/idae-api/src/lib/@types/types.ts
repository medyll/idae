// type-only: DbType is an enum, but a value re-export would pull the whole idae-db
// barrel (→ chromadb) into the browser client bundle. No client code uses it as a value.
export type { DbType } from "@medyll/idae-db";
export interface ApiResponse<T extends object> {
  data?: T[];
  count?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  error?: string;
  success?: boolean;
}
