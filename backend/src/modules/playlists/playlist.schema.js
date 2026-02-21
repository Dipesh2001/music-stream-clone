const { z } = require('zod');

const createPlaylistSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Playlist name is required',
    }).trim().min(1, 'Playlist name cannot be empty'),
    description: z.string().trim().optional(),
    visibility: z.enum(['public', 'private']).optional(),
    coverImage: z.any().optional(),
  }),
});

const addTrackSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Playlist ID format'),
  }),
  body: z.object({
    trackId: z.string({
      required_error: 'Track ID is required',
    }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Track ID format'),
  }),
});

module.exports = {
  createPlaylistSchema,
  addTrackSchema,
};
