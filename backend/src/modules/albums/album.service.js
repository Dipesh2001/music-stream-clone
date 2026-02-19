const Album = require('./album.model');
const Artist = require('../artists/artist.model'); // Required for validation

const createAlbum = async (albumData) => {
  if (!albumData) {
    throw new Error('Album data is required');
  }

  // Validate artists existence
  if (albumData.artists && Array.isArray(albumData.artists)) {
    const artistChecks = await Promise.all(
      albumData.artists.map(id => Artist.findById(id))
    );
    if (artistChecks.some(artist => !artist)) {
      throw new Error('One or more artists not found');
    }
  }

  const album = new Album(albumData);
  await album.save();
  return album;
};

const getAllAlbums = async ({ page = 1, limit = 10, search = '', artistId = '', status = 'all' }) => {
  const skip = (page - 1) * limit;
  const query = {};

  if (search) {
    query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
  }
  if (artistId) {
    query.artists = artistId; // Mongoose handles finding in array automatically
  }
  if (status !== 'all') {
    query.status = status;
  }

  const albums = await Album.find(query)
    .populate('artists', 'name image') // Populate artists' name and image
    .skip(skip)
    .limit(limit)
    .sort({ title: 1 }); // Sort by title ascending

  const total = await Album.countDocuments(query);

  return {
    albums,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getAlbumById = async (id) => {
  const album = await Album.findById(id).populate('artists', 'name image'); // Populate artists
  return album;
};

const updateAlbum = async (id, updateData) => {
  // If artists are being updated, validate existence
  if (updateData.artists && Array.isArray(updateData.artists)) {
    const artistChecks = await Promise.all(
      updateData.artists.map(artId => Artist.findById(artId))
    );
    if (artistChecks.some(artist => !artist)) {
      throw new Error('One or more artists not found');
    }
  }

  const album = await Album.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  return album;
};

const deleteAlbum = async (id) => {
  const album = await Album.findByIdAndUpdate(id, { status: 'inactive' }, { new: true }); // Soft delete
  return album;
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
};
