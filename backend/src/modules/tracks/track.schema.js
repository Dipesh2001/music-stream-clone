const { z } = require('zod');

const createTrackSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }).trim().min(1, 'Title cannot be empty'),
    artists: z.array(z.string({
      required_error: 'Artist IDs are required',
    }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Artist ID format')).min(1, 'At least one artist is required'),
    album: z.string({
      required_error: 'Album ID is required',
    }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Album ID format'),
    audioUrl: z.string({
      required_error: 'Audio URL is required',
    }).url('Invalid Audio URL format').optional(), // Optional during validation if handled by multer/controller
    duration: z.number({
      required_error: 'Duration is required',
    }).positive('Duration must be a positive number'),
    language: z.string().trim().optional(),
    isExplicit: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  }),
});

const updateTrackSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Track ID format'),
  }),
  body: z.object({
    title: z.string().trim().min(1, 'Title cannot be empty').optional(),
    artists: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Artist ID format')).optional(),
    album: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Album ID format').optional(),
    audioUrl: z.string().url('Invalid Audio URL format').optional(),
    duration: z.number().positive('Duration must be a positive number').optional(),
    language: z.string().trim().optional(),
    isExplicit: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }).refine(data => Object.keys(data).length > 0, 'At least one field must be provided for update'),
});

const batchUpdateOrderSchema = z.object({
  albumId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Album ID format'),
  orders: z.array(z.object({
    trackId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Track ID format'),
    order: z.number().int().min(0),
  })).min(1, 'At least one track order must be provided'),
});


module.exports = {
  createTrackSchema,
  updateTrackSchema,
  batchUpdateOrderSchema,
};
