const Artist = require('../artists/artist.model');
const Album = require('../albums/album.model');
const Track = require('../tracks/track.model');
const User = require('../users/user.model');
const Playlist = require('../playlists/playlist.model');

const getDashboardStats = async () => {
    const [totalArtists, totalAlbums, totalTracks, totalUsers, totalPlaylists] = await Promise.all([
        Artist.countDocuments(),
        Album.countDocuments(),
        Track.countDocuments(),
        User.countDocuments(),
        Playlist.countDocuments(),
    ]);

    // Aggregate total plays across all tracks
    const playsResult = await Track.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, totalPlays: { $sum: '$playCount' } } },
    ]);
    const totalPlays = playsResult.length > 0 ? playsResult[0].totalPlays : 0;

    return {
        totalArtists,
        totalAlbums,
        totalTracks,
        totalUsers,
        totalPlaylists,
        totalPlays,
    };
};

const getTopTracks = async ({ limit = 10 }) => {
    const tracks = await Track.find({ status: 'active' })
        .sort({ playCount: -1 })
        .limit(limit)
        .select('title playCount duration artists album')
        .populate('artists', 'name')
        .populate('album', 'title coverImage');

    return tracks.map((t) => {
        const obj = t.toObject();
        return {
            _id: obj._id,
            title: obj.title,
            playCount: obj.playCount,
            duration: obj.duration,
            artistName: obj.artists && obj.artists.length > 0 ? obj.artists[0].name : 'Unknown',
            artistId: obj.artists && obj.artists.length > 0 ? obj.artists[0]._id : '',
            albumTitle: obj.album ? obj.album.title : 'Unknown',
            albumId: obj.album ? obj.album._id : '',
            coverImage: obj.album ? obj.album.coverImage : undefined,
        };
    });
};

const getTopArtists = async ({ limit = 10 }) => {
    // Aggregate play counts per artist
    const pipeline = [
        { $match: { status: 'active' } },
        { $unwind: '$artists' },
        {
            $group: {
                _id: '$artists',
                totalPlays: { $sum: '$playCount' },
                trackCount: { $sum: 1 },
            },
        },
        { $sort: { totalPlays: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'artists',
                localField: '_id',
                foreignField: '_id',
                as: 'artist',
            },
        },
        { $unwind: '$artist' },
        {
            $project: {
                _id: '$artist._id',
                name: '$artist.name',
                image: '$artist.image',
                genres: '$artist.genres',
                totalPlays: 1,
                trackCount: 1,
            },
        },
    ];

    return await Track.aggregate(pipeline);
};

const getTopAlbums = async ({ limit = 10 }) => {
    const pipeline = [
        { $match: { status: 'active' } },
        {
            $group: {
                _id: '$album',
                totalPlays: { $sum: '$playCount' },
                trackCount: { $sum: 1 },
            },
        },
        { $sort: { totalPlays: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'albums',
                localField: '_id',
                foreignField: '_id',
                as: 'album',
            },
        },
        { $unwind: '$album' },
        {
            $lookup: {
                from: 'artists',
                localField: 'album.artists',
                foreignField: '_id',
                as: 'albumArtists',
            },
        },
        {
            $project: {
                _id: '$album._id',
                title: '$album.title',
                coverImage: '$album.coverImage',
                genre: '$album.genre',
                artistName: { $arrayElemAt: ['$albumArtists.name', 0] },
                artistId: { $arrayElemAt: ['$albumArtists._id', 0] },
                totalPlays: 1,
                trackCount: 1,
            },
        },
    ];

    return await Track.aggregate(pipeline);
};

module.exports = {
    getDashboardStats,
    getTopTracks,
    getTopArtists,
    getTopAlbums,
};
