const { z } = require('zod');

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
});

module.exports = {
  updateUserSchema,
};
