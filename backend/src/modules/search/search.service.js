const Artist = require('../artists/artist.model');
const Album = require('../albums/album.model');
const Track = require('../tracks/track.model');

const globalSearch = async (query, { limit = 10 }) => {
  // Construct regex for partial, case-insensitive matching
  const regexQuery = new RegExp(query, 'i');

  const artistResults = await Artist.find({
    $or: [
      { name: regexQuery },
      { genres: regexQuery },
    ],
    status: 'active',
  })
    .limit(limit)
    .select('name image genres');

  const albumResults = await Album.find({
    $or: [
      { title: regexQuery },
      { genres: regexQuery },
    ],
    status: 'active',
  })
    .limit(limit)
    .select('title coverImage genres artists')
    .populate('artists', 'name');

  const trackResults = await Track.find({
    $or: [
      { title: regexQuery },
      { language: regexQuery },
    ],
    status: 'active',
  })
    .limit(limit)
    .select('title audioUrl duration language isExplicit artists album')
    .populate('artists', 'name')
    .populate('album', 'title coverImage');

  return {
    artists: artistResults,
    albums: albumResults,
    tracks: trackResults,
  };
};

module.exports = {
  globalSearch,
};
