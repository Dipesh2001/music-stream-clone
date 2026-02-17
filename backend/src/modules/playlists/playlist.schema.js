const { z } = require('zod');

const createPlaylistSchema = z.object({
  name: z.string({
    required_error: 'Playlist name is required',
  }).trim().min(1, 'Playlist name cannot be empty'),
  description: z.string().trim().optional(),
  isPublic: z.boolean().optional(),
});

const addTrackSchema = z.object({
  trackId: z.string({
    required_error: 'Track ID is required',
  }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Track ID format'),
});

module.exports = {
  createPlaylistSchema,
  addTrackSchema,
};
