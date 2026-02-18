const Favorite = require('./favorite.model');
const Track = require('../tracks/track.model');
const Album = require('../albums/album.model');
const mongoose = require('mongoose');

const checkExistenceAndActiveStatus = async (model, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ID format for ${model.modelName}`);
  }
  const item = await model.findById(id);
  if (!item || item.status !== 'active') {
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

const getMyFavorites = async (userId, { page = 1, limit = 10, search = '' }) => {
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { user: userId } },
    {
      $lookup: {
        from: 'tracks',
        localField: 'track',
        foreignField: '_id',
        as: 'trackDetails',
      },
    },
    {
      $lookup: {
        from: 'albums',
        localField: 'album',
        foreignField: '_id',
        as: 'albumDetails',
      },
    },
    {
      $unwind: { path: '$trackDetails', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$albumDetails', preserveNullAndEmptyArrays: true },
    },
    // Populate artist for trackDetails
    {
      $lookup: {
        from: 'artists',
        localField: 'trackDetails.artist',
        foreignField: '_id',
        as: 'trackDetails.artist',
        pipeline: [
          { $project: { name: 1, image: 1 } }
        ]
      }
    },
    {
      $unwind: { path: '$trackDetails.artist', preserveNullAndEmptyArrays: true },
    },
    // Populate artist for albumDetails
    {
      $lookup: {
        from: 'artists',
        localField: 'albumDetails.artist',
        foreignField: '_id',
        as: 'albumDetails.artist',
        pipeline: [
          { $project: { name: 1, image: 1 } }
        ]
      }
    },
    {
      $unwind: { path: '$albumDetails.artist', preserveNullAndEmptyArrays: true },
    },
  ];

  if (search) {
    pipeline.push({
      $match: {
        $or: [
          { 'trackDetails.title': { $regex: search, $options: 'i' } },
          { 'trackDetails.artist.name': { $regex: search, $options: 'i' } },
          { 'albumDetails.title': { $regex: search, $options: 'i' } },
          { 'albumDetails.artist.name': { $regex: search, $options: 'i' } },
        ],
      },
    });
  }

  const [favoritesWithCount] = await Favorite.aggregate([
    ...pipeline,
    {
      $facet: {
        totalData: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              user: 1,
              track: 1,
              album: 1,
              createdAt: 1,
              updatedAt: 1,
              item: {
                $cond: {
                  if: '$trackDetails._id',
                  then: { type: 'track', data: '$trackDetails' },
                  else: { type: 'album', data: '$albumDetails' },
                },
              },
            },
          },
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  const favorites = favoritesWithCount.totalData.map(fav => fav.item);
  const total = favoritesWithCount.totalCount[0]?.count || 0;

  return {
    favorites,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  likeTrack,
  unlikeTrack,
  likeAlbum,
  unlikeAlbum,
  getMyFavorites,
};
