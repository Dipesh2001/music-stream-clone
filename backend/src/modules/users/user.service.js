const User = require('./user.model');

const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password'); // Exclude password
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const updateMe = async (userId, updateData) => {
  // Only allow updating name and avatar
  const allowedUpdates = {};
  if (updateData.name !== undefined) {
    allowedUpdates.name = updateData.name;
  }
  if (updateData.avatar !== undefined) {
    allowedUpdates.avatar = updateData.avatar;
  }

  if (Object.keys(allowedUpdates).length === 0) {
    throw new Error('No valid fields to update');
  }

  const user = await User.findByIdAndUpdate(userId, allowedUpdates, {
    new: true,
    runValidators: true,
  }).select('-password'); // Exclude password

  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

const getAllUsers = async (filters = {}) => {
  const query = {};
  if (filters.role) query.role = filters.role;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  return users;
};

const updateUserStatus = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(userId, { isActive }, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

module.exports = {
  getMe,
  updateMe,
  getAllUsers,
  updateUserStatus,
};
