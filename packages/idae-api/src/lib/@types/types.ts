export enum DbType {
  MONGODB = "mongodb",
  MYSQL = "mysql",
  CHROMADB = "chromaDb",
  POSTGRESQL = "postgresql",
  SQLITE = "sqlite",
  POUCHDB = "pouchdb"
}

// Re-export for compatibility
export { DbType as IdaeDbType };
export interface ApiResponse<T extends object> {
  data?: T[];
  count?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  error?: string;
  success?: boolean;
}
