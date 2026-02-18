const Favorite = require('../favorites/favorite.model');
const PlayHistory = require('../player/playHistory.model');
const Track = require('../tracks/track.model');
const Artist = require('../artists/artist.model');
const Album = require('../albums/album.model');
const mongoose = require('mongoose');

const getRecommendations = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  // 1. Get user's liked tracks and albums
  const likedFavorites = await Favorite.find({ user: userId })
    .populate('track')
    .populate('album');

  const likedTrackIds = likedFavorites
    .filter(fav => fav.track && fav.track.status === 'active')
    .map(fav => fav.track._id);
  const likedAlbumIds = likedFavorites
    .filter(fav => fav.album && fav.album.status === 'active')
    .map(fav => fav.album._id);

  // 2. Get user's recently played tracks
  const recentlyPlayed = await PlayHistory.find({ user: userId })
    .sort({ playedAt: -1 })
    .limit(20) // Consider a reasonable number of recent plays
    .populate('track');

  const recentlyPlayedTrackIds = recentlyPlayed
    .filter(ph => ph.track && ph.track.status === 'active')
    .map(ph => ph.track._id);

  // Combine all relevant track IDs for exclusion
  const excludedTrackIds = [...new Set([...likedTrackIds, ...recentlyPlayedTrackIds])];

  // 3. Extract relevant artists and genres from liked/played items
  const relevantArtistIds = new Set();
  const relevantGenres = new Set();

  for (const fav of likedFavorites) {
    if (fav.track && fav.track.artist) relevantArtistIds.add(fav.track.artist.toString());
    if (fav.album && fav.album.artist) relevantArtistIds.add(fav.album.artist.toString());

    if (fav.track && fav.track.language) relevantGenres.add(fav.track.language); // Using language as a proxy for genre for tracks
    if (fav.album && fav.album.genres && fav.album.genres.length > 0) {
      fav.album.genres.forEach(genre => relevantGenres.add(genre));
    }
  }

  for (const ph of recentlyPlayed) {
    if (ph.track && ph.track.artist) relevantArtistIds.add(ph.track.artist.toString());
    if (ph.track && ph.track.language) relevantGenres.add(ph.track.language);
  }

  const recommendations = [];
  const recommendedTrackIds = new Set(); // To prevent duplicates in recommendations

  // Recommendation Strategy 1: Tracks from same artists
  if (relevantArtistIds.size > 0) {
    const artistTracks = await Track.find({
      artist: { $in: Array.from(relevantArtistIds) },
      _id: { $nin: excludedTrackIds },
      status: 'active',
    })
    .limit(limit)
    .populate('artist', 'name')
    .populate('album', 'title coverImage')
    .lean();
    artistTracks.forEach(track => {
      if (!recommendedTrackIds.has(track._id.toString())) {
        recommendations.push(track);
        recommendedTrackIds.add(track._id.toString());
      }
    });
  }

  // Recommendation Strategy 2: Tracks from same genres (or languages for tracks)
  if (relevantGenres.size > 0 && recommendations.length < limit) {
    const genreTracks = await Track.find({
      $or: [
        { language: { $in: Array.from(relevantGenres) } },
        // { album: { $in: likedAlbumIds } } // Tracks from liked albums by genre is covered by album
      ],
      _id: { $nin: Array.from(recommendedTrackIds) }, // Exclude already recommended
      status: 'active',
    })
    .limit(limit - recommendations.length)
    .populate('artist', 'name')
    .populate('album', 'title coverImage')
    .lean();

    genreTracks.forEach(track => {
      if (!recommendedTrackIds.has(track._id.toString())) {
        recommendations.push(track);
        recommendedTrackIds.add(track._id.toString());
      }
    });
  }

  // Fallback: If not enough recommendations, just get some popular tracks
  if (recommendations.length < limit) {
    const fallbackTracks = await Track.find({
      _id: { $nin: Array.from(recommendedTrackIds) },
      status: 'active',
    })
    .sort({ playCount: -1 }) // Sort by playCount for popularity
    .limit(limit - recommendations.length)
    .populate('artist', 'name')
    .populate('album', 'title coverImage')
    .lean();
    fallbackTracks.forEach(track => {
      if (!recommendedTrackIds.has(track._id.toString())) {
        recommendations.push(track);
        recommendedTrackIds.add(track._id.toString());
      }
    });
  }

  // Apply pagination at the end
  const paginatedRecommendations = recommendations.slice(skip, skip + limit);

  const total = recommendations.length;

  return {
    recommendations: paginatedRecommendations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

module.exports = {
  getRecommendations,
};
