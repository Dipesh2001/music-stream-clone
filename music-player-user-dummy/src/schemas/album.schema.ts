// music-player-user-dummy/src/schemas/album.schema.ts
import { z } from 'zod';

// Helper for validating MongoDB ObjectId format
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const createAlbumSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    artists: z.array(objectId, {
      invalid_type_error: 'Artists must be an array of valid ObjectIds',
    }).min(1, 'At least one artist is required'),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    releaseDate: z.string().datetime('Release date must be a valid date string').optional(),
    genre: z.string().optional(),
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
    }).optional(),
  }),
});

export const updateAlbumSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    artists: z.array(objectId, {
      invalid_type_error: 'Artists must be an array of valid ObjectIds',
    }).min(1, 'At least one artist is required').optional(),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    releaseDate: z.string().datetime('Release date must be a valid date string').optional(),
    genre: z.string().optional(),
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
    }).optional(),
  }).partial(),
});
