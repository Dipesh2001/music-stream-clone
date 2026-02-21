// music-player-user-dummy/src/schemas/playlist.schema.ts
import { z } from 'zod';

// Helper for validating MongoDB ObjectId format
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

export const createPlaylistSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Playlist name is required',
    }).trim().min(1, 'Playlist name cannot be empty'),
    description: z.string().trim().optional(),
    isPublic: z.boolean().optional(),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
  }),
});

export const addTrackSchema = z.object({
  params: z.object({
    id: objectId, // Playlist ID
  }),
  body: z.object({
    trackId: objectId,
  }),
});
