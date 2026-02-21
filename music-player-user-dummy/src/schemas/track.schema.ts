// music-player-user-dummy/src/schemas/track.schema.ts
import { z } from 'zod';

// Helper for validating MongoDB ObjectId format
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const createTrackSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).trim().min(1, 'Title cannot be empty'),
    artists: z.array(objectId, {
      invalid_type_error: 'Artists must be an array of valid ObjectIds',
    }).min(1, 'At least one artist is required'),
    album: objectId,
    audioUrl: z.string().url('Invalid Audio URL format'),
    duration: z.number({
      required_error: 'Duration is required',
    }).positive('Duration must be a positive number'),
    language: z.string().trim().optional(),
    isExplicit: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  }),
});

export const updateTrackSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    title: z.string().trim().min(1, 'Title cannot be empty').optional(),
    artists: z.array(objectId, {
      invalid_type_error: 'Artists must be an array of valid ObjectIds',
    }).min(1, 'At least one artist is required').optional(),
    album: objectId.optional(),
    audioUrl: z.string().url('Invalid Audio URL format').optional(),
    duration: z.number().positive('Duration must be a positive number').optional(),
    language: z.string().trim().optional(),
    isExplicit: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
    status: z.enum(['active', 'inactive'], {
      errorMap: () => ({ message: "Status must be 'active' or 'inactive'" }),
    }).optional(),
  }).partial().refine(data => Object.keys(data).length > 0, 'At least one field must be provided for update'),
});

export const batchUpdateOrderSchema = z.object({
  albumId: objectId,
  orders: z.array(z.object({
    trackId: objectId,
    order: z.number().int().min(0),
  })).min(1, 'At least one track order must be provided'),
});
