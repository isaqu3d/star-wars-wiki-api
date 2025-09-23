// Common types used across the application
export type PaginationQuery = {
  page: number;
  limit: number;
};

export type SearchQuery = {
  search?: string;
};

export type OrderQuery<T extends string> = {
  orderBy: T;
};

export type ApiResponse<T> = {
  data: T;
  total?: number;
};

export type ErrorResponse = {
  message: string;
  error?: string;
};