const Artist = require('./artist.model');

const createArtist = async (artistData) => {
  const artist = new Artist(artistData);
  await artist.save();
  return artist;
};

const getAllArtists = async ({ page = 1, limit = 10, search = '' }) => {
  const skip = (page - 1) * limit;
  const query = { isActive: true }; // Only return active artists for public API

  if (search) {
    query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
  }

  const artists = await Artist.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ name: 1 }); // Sort by name ascending

  const total = await Artist.countDocuments(query);

  return {
    artists,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getArtistById = async (id) => {
  const artist = await Artist.findById(id);
  return artist;
};

const updateArtist = async (id, updateData) => {
  const artist = await Artist.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  return artist;
};

const deleteArtist = async (id) => {
  const artist = await Artist.findByIdAndUpdate(id, { isActive: false }, { new: true }); // Soft delete
  return artist;
};

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
