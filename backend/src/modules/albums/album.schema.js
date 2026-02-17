const z = require('zod');
const mongoose = require('mongoose');

const createAlbumSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    artist: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid Artist ID'),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    releaseDate: z.string().datetime('Release date must be a valid date string').optional(),
    genres: z.array(z.string()).optional(),
  }),
});

const updateAlbumSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Album ID is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    artist: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid Artist ID').optional(),
    coverImage: z.string().url('Cover image must be a valid URL').optional(),
    releaseDate: z.string().datetime('Release date must be a valid date string').optional(),
    genres: z.array(z.string()).optional(),
    isActive: z.boolean().optional(), // Allow admin to change isActive
  }).partial(), // All fields are optional for update
});

module.exports = {
  createAlbumSchema,
  updateAlbumSchema,
};
