const Track = require('../src/modules/tracks/track.model');

const artistsWithTracksData = [
    {
        artistName: 'Luna Eclipse',
        albumName: 'Lunar Phases',
        genre: 'Electronic',
        coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        tracks: [
            { title: 'Crescent Moon', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 215 },
            { title: 'Orbiting', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 184 },
            { title: 'Stardust Mix', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 250 },
            { title: 'Zero Gravity', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 198 },
            { title: 'Eclipse (Outro)', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: 140 }
        ]
    },
    {
        artistName: 'Neon Waves',
        albumName: 'Retro Future',
        genre: 'Synthwave',
        coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
        tracks: [
            { title: 'Neon Lights', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', duration: 240 },
            { title: 'Cyber Drive', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', duration: 205 },
            { title: 'VHS Dreams', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', duration: 190 },
            { title: 'Atari Sunset', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', duration: 260 },
            { title: 'The Grid', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', duration: 175 }
        ]
    },
    {
        artistName: 'Velvet Skies',
        albumName: 'Smooth Elements',
        genre: 'Jazz',
        coverImage: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
        tracks: [
            { title: 'Midnight Sax', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', duration: 310 },
            { title: 'Coffee House', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', duration: 280 },
            { title: 'City Lights', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', duration: 245 },
            { title: 'Rainy Afternoons', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', duration: 220 },
            { title: 'Jazz Walk', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', duration: 195 }
        ]
    },
    {
        artistName: 'Solaris Duo',
        albumName: 'Acoustic Soul',
        genre: 'Folk',
        coverImage: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop',
        tracks: [
            { title: 'Morning Dew', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', duration: 200 },
            { title: 'Wandering Path', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3', duration: 185 },
            { title: 'Campfire Stories', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 230 },
            { title: 'Acoustic Sunrise', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 210 },
            { title: 'River Song', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: 170 }
        ]
    }
];

const generateTracks = (albums) => {
    const tracks = [];

    albums.forEach((album) => {
        // Find which artist this album belongs to
        const artistData = artistsWithTracksData.find(a => album.title === a.albumName);
        if (!artistData) return;

        artistData.tracks.forEach((trackData, i) => {
            tracks.push({
                title: trackData.title,
                artists: album.artists, // Same as album artists
                album: album._id,
                audioUrl: trackData.audioUrl,
                duration: trackData.duration,
                language: 'English',
                isExplicit: false,
                order: i + 1,
                status: 'active'
            });
        });
    });

    return tracks;
};

const seedTracks = async (albums) => {
    if (!albums || albums.length === 0) {
        throw new Error('Albums are required to seed tracks.');
    }

    try {
        const deleted = await Track.deleteMany({});
        console.log(`- Cleared ${deleted.deletedCount} tracks.`);

        const tracksData = generateTracks(albums);
        const inserted = await Track.insertMany(tracksData);
        console.log(`- Inserted ${inserted.length} tracks.`);
        return inserted;
    } catch (error) {
        console.error('Error seeding tracks:', error);
        throw error;
    }
};

module.exports = { seedTracks, artistsWithTracksData };
