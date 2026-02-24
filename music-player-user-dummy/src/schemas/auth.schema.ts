// music-player-user-dummy/src/schemas/auth.schema.ts
import { z } from 'zod';
import { Role } from '../types/user.types'; // Import Role enum from user.types

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Schema for the user object returned in IAuthResponse
export const userSchema = z.object({
  _id: z.string(),
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  avatar: z.string().optional(),
  role: z.nativeEnum(Role), // Use z.nativeEnum for TypeScript enums
  isActive: z.boolean(),
  createdAt: z.string().datetime().optional(), // optional as it might not be present in all user representations
  updatedAt: z.string().datetime().optional(), // optional as it might not be present in all user representations
});

// Schema for the full IAuthResponse
export const authResponseSchema = z.object({
  user: userSchema,
});