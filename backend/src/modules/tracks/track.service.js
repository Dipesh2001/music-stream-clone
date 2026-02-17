const Track = require('./track.model');
const Artist = require('../artists/artist.model');
const Album = require('../albums/album.model');
const mongoose = require('mongoose');

const createTrack = async (trackData) => {
  const { artist: artistId, album: albumId } = trackData;

  // Validate Artist and Album existence
  const artist = await Artist.findById(artistId);
  if (!artist) {
    throw new Error('Artist not found');
  }

  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error('Album not found');
  }

  // Ensure album belongs to the artist
  if (album.artist.toString() !== artistId) {
    throw new Error('Album does not belong to the specified artist');
  }

  const track = new Track(trackData);
  await track.save();
  return track;
};

const getAllTracks = async ({ page = 1, limit = 10, search = '', albumId, artistId, includeInactive = false }) => {
  const skip = (page - 1) * limit;
  const query = {};

  if (!includeInactive) {
    query.isActive = true;
  }

  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  if (albumId) {
    if (!mongoose.Types.ObjectId.isValid(albumId)) {
      throw new Error('Invalid Album ID format');
    }
    query.album = albumId;
  }

  if (artistId) {
    if (!mongoose.Types.ObjectId.isValid(artistId)) {
      throw new Error('Invalid Artist ID format');
    }
    query.artist = artistId;
  }

  const tracks = await Track.find(query)
    .populate({
      path: 'artist',
      select: 'name image -_id', // Select only name and image for artist
    })
    .populate({
      path: 'album',
      select: 'title coverImage -_id', // Select only title and coverImage for album
    })
    .skip(skip)
    .limit(parseInt(limit))
    .lean(); // Use .lean() for faster query if not modifying the document

  const totalTracks = await Track.countDocuments(query);

  return {
    tracks,
    totalTracks,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(totalTracks / limit),
  };
};

const getTrackById = async (id, includeInactive = false) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Track ID format');
  }

  const query = { _id: id };
  if (!includeInactive) {
    query.isActive = true;
  }

  const track = await Track.findOne(query)
    .populate({
      path: 'artist',
      select: 'name image -_id',
    })
    .populate({
      path: 'album',
      select: 'title coverImage -_id',
    })
    .lean();

  if (!track) {
    throw new Error('Track not found');
  }
  return track;
};

const updateTrack = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Track ID format');
  }

  const track = await Track.findById(id);
  if (!track) {
    throw new Error('Track not found');
  }

  // If artist or album is updated, re-validate relationship
  if (updateData.artist || updateData.album) {
    const artistId = updateData.artist || track.artist.toString();
    const albumId = updateData.album || track.album.toString();

    const artist = await Artist.findById(artistId);
    if (!artist) {
      throw new Error('Artist not found');
    }

    const album = await Album.findById(albumId);
    if (!album) {
      throw new Error('Album not found');
    }

    if (album.artist.toString() !== artistId) {
      throw new Error('Album does not belong to the specified artist');
    }
  }

  Object.assign(track, updateData);
  await track.save();
  return track;
};

const deleteTrack = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Track ID format');
  }

  const track = await Track.findById(id);
  if (!track) {
    throw new Error('Track not found');
  }

  track.isActive = false; // Soft delete
  await track.save();
  return { message: 'Track soft-deleted successfully' };
};

const incrementPlayCount = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Track ID format');
  }

  const track = await Track.findByIdAndUpdate(
    id,
    { $inc: { playCount: 1 } },
    { new: true } // Return the updated document
  ).lean();

  if (!track) {
    throw new Error('Track not found');
  }
  return track;
};


module.exports = {
  createTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
  incrementPlayCount,
};
