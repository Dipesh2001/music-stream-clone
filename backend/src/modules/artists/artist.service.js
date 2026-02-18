const Artist = require('./artist.model');

const createArtist = async (artistData) => {
  const artist = new Artist(artistData);
  await artist.save();
  return artist;
};

const getAllArtists = async ({ page = 1, limit = 10, search = '', status = 'all' }) => {
  const skip = (page - 1) * limit;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { genres: { $regex: search, $options: 'i' } },
    ];
  }

  if (status !== 'all') {
    query.status = status;
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
  const artist = await Artist.findByIdAndUpdate(id, { status: 'inactive' }, { new: true }); // Soft delete
  return artist;
};

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
};
