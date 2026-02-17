const Favorite = require('./favorite.model');
const Track = require('../tracks/track.model');
const Album = require('../albums/album.model');
const mongoose = require('mongoose');

const checkExistenceAndActiveStatus = async (model, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ID format for ${model.modelName}`);
  }
  const item = await model.findById(id);
  if (!item || !item.isActive) {
    throw new Error(`${model.modelName} not found or is inactive`);
  }
  return item;
};

const likeTrack = async (userId, trackId) => {
  await checkExistenceAndActiveStatus(Track, trackId);

  const existingFavorite = await Favorite.findOne({ user: userId, track: trackId });
  if (existingFavorite) {
    throw new Error('Track already in favorites');
  }

  const favorite = new Favorite({ user: userId, track: trackId });
  await favorite.save();
  return favorite;
};

const unlikeTrack = async (userId, trackId) => {
  if (!mongoose.Types.ObjectId.isValid(trackId)) {
    throw new Error('Invalid ID format for Track');
  }
  const result = await Favorite.deleteOne({ user: userId, track: trackId });
  if (result.deletedCount === 0) {
    throw new Error('Track not found in favorites');
  }
  return { message: 'Track removed from favorites' };
};

const likeAlbum = async (userId, albumId) => {
  await checkExistenceAndActiveStatus(Album, albumId);

  const existingFavorite = await Favorite.findOne({ user: userId, album: albumId });
  if (existingFavorite) {
    throw new Error('Album already in favorites');
  }

  const favorite = new Favorite({ user: userId, album: albumId });
  await favorite.save();
  return favorite;
};

const unlikeAlbum = async (userId, albumId) => {
  if (!mongoose.Types.ObjectId.isValid(albumId)) {
    throw new Error('Invalid ID format for Album');
  }
  const result = await Favorite.deleteOne({ user: userId, album: albumId });
  if (result.deletedCount === 0) {
    throw new Error('Album not found in favorites');
  }
  return { message: 'Album removed from favorites' };
};

const getMyFavorites = async (userId) => {
  const favorites = await Favorite.find({ user: userId })
    .populate({
      path: 'track',
      select: 'title duration audioUrl artist',
      populate: {
        path: 'artist',
        select: 'name -_id',
      },
    })
    .populate({
      path: 'album',
      select: 'title coverImage artist',
      populate: {
        path: 'artist',
        select: 'name -_id',
      },
    })
    .lean();

  return favorites.map(fav => {
    if (fav.track) {
      return { type: 'track', item: fav.track };
    }
    if (fav.album) {
      return { type: 'album', item: fav.album };
    }
    return fav; // Should not happen with validation
  });
};

module.exports = {
  likeTrack,
  unlikeTrack,
  likeAlbum,
  unlikeAlbum,
  getMyFavorites,
};
