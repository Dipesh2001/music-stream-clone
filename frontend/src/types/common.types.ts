// frontend/src/types/common.types.ts

// Base interface for all API responses
export interface BaseApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  // Potentially other common fields like errors array
}

// Pagination metadata
export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

// Generic paginated response
export interface PaginatedApiResponse<T> extends BaseApiResponse<T[]> {
  pagination: Pagination;
}
