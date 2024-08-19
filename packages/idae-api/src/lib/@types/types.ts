export interface ApiResponse<T extends object> {
  data?: T[];
  count?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  error?: string;
  success?: boolean;
}
