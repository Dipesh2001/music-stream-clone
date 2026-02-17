const { z } = require('zod');

const createTrackSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }).trim().min(1, 'Title cannot be empty'),
  artist: z.string({
    required_error: 'Artist ID is required',
  }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Artist ID format'),
  album: z.string({
    required_error: 'Album ID is required',
  }).regex(/^[0-9a-fA-F]{24}$/, 'Invalid Album ID format'),
  audioUrl: z.string({
    required_error: 'Audio URL is required',
  }).url('Invalid Audio URL format'),
  duration: z.number({
    required_error: 'Duration is required',
  }).positive('Duration must be a positive number'),
  language: z.string().trim().optional(),
  isExplicit: z.boolean().optional(),
});

const updateTrackSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').optional(),
  artist: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Artist ID format').optional(),
  album: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Album ID format').optional(),
  audioUrl: z.string().url('Invalid Audio URL format').optional(),
  duration: z.number().positive('Duration must be a positive number').optional(),
  language: z.string().trim().optional(),
  isExplicit: z.boolean().optional(),
  isActive: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, 'At least one field must be provided for update');


module.exports = {
  createTrackSchema,
  updateTrackSchema,
};
