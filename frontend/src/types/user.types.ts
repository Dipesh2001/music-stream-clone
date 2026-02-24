// frontend/src/types/user.types.ts

import type { AuthUser, Role } from './auth.types';

// Assuming for now User is similar to AuthUser but might expand later
export interface User extends AuthUser {
  // Additional user-specific fields can be added here
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  isActive: boolean;
  // etc.
}

// For simplicity, defining a generic update user payload
export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
  email?: string;
  password?: string;
  role?: Role;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data: User;
}
