// music-player-user-dummy/src/types/auth.types.ts

import { z } from 'zod';
import { loginSchema, registerSchema, userSchema, authResponseSchema } from '../schemas/auth.schema';
import { Role } from './user.types'; // Import Role enum from user.types

export { Role }; // Re-export Role for convenience

export type IRegisterPayload = z.infer<typeof registerSchema>;
export type ILoginPayload = z.infer<typeof loginSchema>;

export interface IAuthResponse {
  user: {
    _id: string;
    email: string;
    name?: string;
    avatar?: string;
    role: Role;
    isActive: boolean;
  };
}
