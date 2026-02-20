const Track = require('./track.model');
const Artist = require('../artists/artist.model');
const Album = require('../albums/album.model');
const mongoose = require('mongoose');

const createTrack = async (trackData) => {
  const { artists: artistIds, album: albumId } = trackData;

  // Validate Artists and Album existence
  const artistsCount = await Artist.countDocuments({ _id: { $in: artistIds } });
  if (artistsCount !== artistIds.length) {
    throw new Error('One or more artists not found');
  }

  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error('Album not found');
  }

  // Ensure album belongs to at least one of the specified artists
  const hasValidArtist = album.artists.some(id => artistIds.includes(id.toString()));
  if (!hasValidArtist) {
    throw new Error('Album does not belong to any of the specified artists');
  }

  const track = new Track(trackData);
  await track.save();
  return track;
};

const getAllTracks = async ({ page = 1, limit = 10, search = '', albumId, artistId, includeInactive = false }) => {
  const skip = (page - 1) * limit;
  const query = {};
  if (!includeInactive) {
    query.status = 'active';
  }

  if (search) {
    const [matchingArtists, matchingAlbums] = await Promise.all([
      Artist.find({ name: { $regex: search, $options: 'i' } }).select('_id'),
      Album.find({ title: { $regex: search, $options: 'i' } }).select('_id')
    ]);

    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { artists: { $in: matchingArtists.map(a => a._id) } },
      { album: { $in: matchingAlbums.map(a => a._id) } }
    ];
  }

  if (albumId) {
    const albumIds = Array.isArray(albumId) ? albumId : [albumId];
    if (albumIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error('Invalid Album ID format');
    }
    if (albumIds.length > 0) {
      query.album = { $in: albumIds };
    }
  }

  if (artistId) {
    const artistIds = Array.isArray(artistId) ? artistId : [artistId];
    if (artistIds.length > 0) {
      query.artists = { $in: artistIds };
    }
  }

  const tracks = await Track.find(query)
    .populate({
      path: 'artists',
      select: 'name image',
    })
    .populate({
      path: 'album',
      select: 'title coverImage', // Include _id to allow ID matching in frontend
    })
    .skip(skip)
    .limit(parseInt(limit))
    .lean(); // Use .lean() for faster query if not modifying the document

  const total = await Track.countDocuments(query);

  return {
    tracks,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(total / limit),
  };
};

const getTrackById = async (id, includeInactive = false) => {
  const query = { _id: id };
  if (!includeInactive) {
    query.status = 'active';
  }

  const track = await Track.findOne(query)
    .populate({
      path: 'artists',
      select: 'name image',
    })
    .populate({
      path: 'album',
      select: 'title coverImage',
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

  // If artists or album is updated, re-validate relationship
  if (updateData.artists || updateData.album) {
    const artistIds = updateData.artists || track.artists.map(id => id.toString());
    const albumId = updateData.album || track.album.toString();

    const artistsCount = await Artist.countDocuments({ _id: { $in: artistIds } });
    if (artistsCount !== artistIds.length) {
      throw new Error('One or more artists not found');
    }

    const album = await Album.findById(albumId);
    if (!album) {
      throw new Error('Album not found');
    }

    const hasValidArtist = album.artists.some(id => artistIds.includes(id.toString()));
    if (!hasValidArtist) {
      throw new Error('Album does not belong to any of the specified artists');
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

  track.status = 'inactive'; // Soft delete
  await track.save();
  return { message: 'Track soft-deleted successfully' };
};

const incrementPlayCount = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Track ID format');
  }

  const track = await Track.findById(id);
  if (!track) {
    throw new Error('Track not found');
  }
  if (track.status !== 'active') {
    throw new Error('Cannot increment play count for an inactive track');
  }

  track.playCount = (track.playCount || 0) + 1;
  await track.save();
  return track;
};


const updateTrackOrder = async ({ albumId, orders }) => {
  if (!mongoose.Types.ObjectId.isValid(albumId)) {
    throw new Error('Invalid Album ID format');
  }

  const batchOps = orders.map(({ trackId, order }) => ({
    updateOne: {
      filter: { _id: trackId, album: albumId },
      update: { $set: { order } },
    },
  }));

  await Track.bulkWrite(batchOps);
  return { message: 'Track orders updated successfully' };
};


module.exports = {
  createTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
  incrementPlayCount,
  updateTrackOrder,
};
