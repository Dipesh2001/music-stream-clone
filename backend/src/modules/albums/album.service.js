const Album = require('./album.model');
const Artist = require('../artists/artist.model'); // Required for validation

const createAlbum = async (albumData) => {
  // Validate artist existence
  const artistExists = await Artist.findById(albumData.artist);
  if (!artistExists) {
    throw new Error('Artist not found');
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
    query.artist = artistId; // Filter by artistId
  }
  if (status !== 'all') {
    query.status = status;
  }

  const albums = await Album.find(query)
    .populate('artist', 'name image') // Populate artist's name and image
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
  const album = await Album.findById(id).populate('artist', 'name image'); // Populate artist
  return album;
};

const updateAlbum = async (id, updateData) => {
  // If artist is being updated, validate artist existence
  if (updateData.artist) {
    const artistExists = await Artist.findById(updateData.artist);
    if (!artistExists) {
      throw new Error('Artist not found');
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
