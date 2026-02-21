const Playlist = require('../src/modules/playlists/playlist.model');
const User = require('../src/modules/users/user.model');

const generatePlaylists = (tracks, user) => {
    if (!user) return [];

    return [
        {
            name: 'Midnight Chill',
            description: 'The best lofi and ambient tracks for late night study sessions.',
            owner: user._id,
            tracks: tracks.slice(0, 10).map(t => t._id),
            isPublic: true,
            coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
            status: 'active'
        },
        {
            name: 'Workout Energy',
            description: 'Get your heart racing with high bpm techno and industrial beats.',
            owner: user._id,
            tracks: tracks.slice(10, 20).map(t => t._id),
            isPublic: true,
            coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
            status: 'active'
        },
        {
            name: 'Sunday Morning Jazz',
            description: 'Smooth jazz melodies to start your day right.',
            owner: user._id,
            tracks: tracks.slice(20, 30).map(t => t._id),
            isPublic: false,
            coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
            status: 'active'
        }
    ];
};

const seedPlaylists = async (tracks) => {
    if (!tracks || tracks.length === 0) {
        throw new Error('Tracks are required to seed playlists.');
    }

    try {
        const deleted = await Playlist.deleteMany({});
        console.log(`- Cleared ${deleted.deletedCount} playlists.`);

        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            user = await User.findOne(); // Grab any user if test@example.com doesn't exist
        }

        if (!user) {
            console.log('- No users found, skipping playlist seeding.');
            return [];
        }

        const playlistsData = generatePlaylists(tracks, user);
        const inserted = await Playlist.insertMany(playlistsData);
        console.log(`- Inserted ${inserted.length} playlists for user ${user.email}.`);
        return inserted;
    } catch (error) {
        console.error('Error seeding playlists:', error);
        throw error;
    }
};

module.exports = seedPlaylists;

if (require.main === module) {
    require('dotenv').config({ path: './backend/.env' });
    const connectDB = require('../src/config/db');
    const mongoose = require('mongoose');
    const Track = require('../src/modules/tracks/track.model');

    const run = async () => {
        await connectDB();
        const tracks = await Track.find().limit(50);
        await seedPlaylists(tracks);
        await mongoose.disconnect();
    };
    run();
}
