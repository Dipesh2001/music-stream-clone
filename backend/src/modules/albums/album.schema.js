const z = require('zod');
const mongoose = require('mongoose');

const createAlbumSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    artists: z.array(z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid Artist ID')).min(1, 'At least one artist is required'),
    coverImage: z.string().optional(),
    releaseDate: z.string().optional(),
    genre: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const updateAlbumSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Album ID is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    artists: z.array(z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid Artist ID')).optional(),
    coverImage: z.string().optional(),
    releaseDate: z.string().optional(),
    genre: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }).partial(), // All fields are optional for update
});

module.exports = {
  createAlbumSchema,
  updateAlbumSchema,
};
