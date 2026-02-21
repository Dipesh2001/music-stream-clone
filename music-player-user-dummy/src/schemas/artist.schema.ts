// music-player-user-dummy/src/schemas/artist.schema.ts
import { z } from 'zod';

// Helper for validating MongoDB ObjectId format (re-used from album.schema.ts if needed elsewhere)
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');


export const createArtistSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    bio: z.string().optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    genres: z.array(z.string()).optional(),
    debutDate: z.string().datetime('Debut date must be a valid date string').optional(),
  }),
});

export const updateArtistSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    bio: z.string().optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    genres: z.array(z.string()).optional(),
    debutDate: z.string().datetime('Debut date must be a valid date string').optional(),
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
    }).optional(),
  }).partial(),
});
