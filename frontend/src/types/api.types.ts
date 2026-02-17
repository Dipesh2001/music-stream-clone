// frontend/src/types/api.types.ts

export interface ApiError {
  message: string;
  statusCode: number;
  // Potentially more error details
  errors?: string[];
}
