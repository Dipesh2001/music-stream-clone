const Artist = require('../artists/artist.model');
const Album = require('../albums/album.model');
const Track = require('../tracks/track.model');

const globalSearch = async (query, { limit = 10 }) => {
  const searchCriteria = { $text: { $search: query }, isActive: true };

  const artistResults = await Artist.find(searchCriteria)
    .limit(limit)
    .select('name image genres');

  const albumResults = await Album.find(searchCriteria)
    .limit(limit)
    .select('title coverImage genres artist')
    .populate('artist', 'name');

  const trackResults = await Track.find(searchCriteria)
    .limit(limit)
    .select('title audioUrl duration language isExplicit artist album')
    .populate('artist', 'name')
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
