const Album = require('../src/modules/albums/album.model');
const { artistsWithTracksData } = require('./seedTracks');

const generateAlbums = (artists) => {
    const albums = [];

    artists.forEach((artist) => {
        const artistData = artistsWithTracksData.find(a => a.artistName === artist.name);
        if (!artistData) return;

        albums.push({
            title: artistData.albumName,
            artists: [artist._id],
            coverImage: artistData.coverImage,
            releaseDate: new Date(),
            genre: artistData.genre,
            status: 'active'
        });
    });

    return albums;
};

const seedAlbums = async (artists) => {
    if (!artists || artists.length === 0) {
        throw new Error('Artists are required to seed albums.');
    }

    try {
        const deleted = await Album.deleteMany({});
        console.log(`- Cleared ${deleted.deletedCount} albums.`);

        const albumsData = generateAlbums(artists);
        const inserted = await Album.insertMany(albumsData);
        console.log(`- Inserted ${inserted.length} albums.`);
        return inserted;
    } catch (error) {
        console.error('Error seeding albums:', error);
        throw error;
    }
};

module.exports = seedAlbums;
