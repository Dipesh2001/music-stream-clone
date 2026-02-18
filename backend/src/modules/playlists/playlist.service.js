const Playlist = require('./playlist.model');
const Track = require('../tracks/track.model');
const User = require('../users/user.model'); // Although not directly used for validation here, good practice to have access if needed for future logic
const mongoose = require('mongoose');

const checkPlaylistOwnership = async (playlistId, userId) => {
  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new Error('Playlist not found');
  }
  if (playlist.owner.toString() !== userId.toString()) {
    throw new Error('Forbidden: You do not own this playlist');
  }
  return playlist;
};

const createPlaylist = async (userId, playlistData) => {
  const playlist = new Playlist({ ...playlistData, owner: userId });
  await playlist.save();
  return playlist;
};

const getMyPlaylists = async (userId, { page = 1, limit = 10, search = '' }) => {
  const skip = (page - 1) * limit;
  const query = { owner: userId, status: 'active' };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  const playlists = await Playlist.find(query)
    .populate({
      path: 'tracks',
      select: 'title duration artist status',
      match: { status: 'active' }, // Only populate active tracks
      populate: {
        path: 'artist',
        select: 'name -_id'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Playlist.countDocuments(query);

  return {
    playlists,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getPublicPlaylists = async ({ page = 1, limit = 10, search = '' }) => {
  const skip = (page - 1) * limit;
  const query = { isPublic: true, status: 'active' };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const playlists = await Playlist.find(query)
    .populate({
      path: 'tracks',
      select: 'title duration artist status',
      match: { status: 'active' }, // Only populate active tracks
      populate: {
        path: 'artist',
        select: 'name -_id'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPlaylists = await Playlist.countDocuments(query);

  return {
    playlists,
    totalPlaylists,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(totalPlaylists / limit),
  };
};

const getPlaylistById = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid Playlist ID format');
  }

  const playlist = await Playlist.findById(id)
    .populate({
      path: 'owner',
      select: 'name email -_id'
    })
    .populate({
      path: 'tracks',
      select: 'title duration artist status',
      match: { status: 'active' }, // Only populate active tracks
      populate: {
        path: 'artist',
        select: 'name -_id'
      }
    });

  if (!playlist || playlist.status !== 'active') {
    throw new Error('Playlist not found');
  }

  // If playlist is private, only owner can view
  if (!playlist.isPublic && playlist.owner.toString() !== userId.toString()) {
    throw new Error('Forbidden: You do not have access to this private playlist');
  }

  return playlist;
};

const addTrackToPlaylist = async (playlistId, trackId, userId) => {
  const playlist = await checkPlaylistOwnership(playlistId, userId);

  // Validate Track existence and ensure it's active
  const track = await Track.findById(trackId);
  if (!track || track.status !== 'active') {
    throw new Error('Track not found or is inactive');
  }

  // Prevent duplicate tracks
  if (playlist.tracks.includes(trackId)) {
    throw new Error('Track already in playlist');
  }

  playlist.tracks.push(trackId);
  await playlist.save();
  return playlist;
};

const removeTrackFromPlaylist = async (playlistId, trackId, userId) => {
  const playlist = await checkPlaylistOwnership(playlistId, userId);

  // Check if track exists in playlist
  if (!playlist.tracks.includes(trackId)) {
    throw new Error('Track not found in playlist');
  }

  playlist.tracks = playlist.tracks.filter(
    (track) => track.toString() !== trackId.toString()
  );
  await playlist.save();
  return playlist;
};

const deletePlaylist = async (playlistId, userId) => {
  const playlist = await checkPlaylistOwnership(playlistId, userId);

  playlist.status = 'inactive'; // Soft delete
  await playlist.save();
  return { message: 'Playlist soft-deleted successfully' };
};

module.exports = {
  createPlaylist,
  getMyPlaylists,
  getPublicPlaylists,
  getPlaylistById,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  deletePlaylist,
};
