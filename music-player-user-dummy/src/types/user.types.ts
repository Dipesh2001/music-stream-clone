// music-player-user-dummy/src/types/user.types.ts

import { z } from 'zod';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin', // Assuming a SUPER_ADMIN role might exist based on previous App.tsx
}

export interface IUser {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserUpdatePayload {
  name?: string;
  avatar?: string;
}

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
}).strict(); // .strict() to disallow unknown keys
