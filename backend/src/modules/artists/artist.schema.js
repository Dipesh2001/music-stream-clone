const z = require('zod');

const createArtistSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    bio: z.string().optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    genres: z.array(z.string()).optional(),
  }),
});

const updateArtistSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Artist ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    bio: z.string().optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    genres: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }).partial(), // All fields are optional for update
});

module.exports = {
  createArtistSchema,
  updateArtistSchema,
};
