// frontend/src/types/common.types.ts

// Base interface for all API responses
export interface BaseApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  // Potentially other common fields like errors array
}

// Pagination metadata (from what the backend returns)
export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  total: number; // Renamed from totalResults
}

// Generic structure for paginated results from the backend before BaseApiResponse wraps it
export interface PaginatedResult<T> {
  artists?: T[]; // The actual array of items, could be 'docs' or specific like 'artists'
  tracks?: T[]; // Example for other modules
  albums?: T[]; // Example for other modules
  users?: T[]; // Example for other modules
  playlists?: T[];
  data?: T[]; // General fallback if the key is generic 'data' at the backend service level
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
