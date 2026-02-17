// frontend/src/types/auth.types.ts (Updated)

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // e.g., in seconds
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: LoginResponseData;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  message?: string;
  data: RefreshTokenResponseData;
}
