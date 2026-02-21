export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[] | any; // e.g. tracks: Track[], total: number
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}
