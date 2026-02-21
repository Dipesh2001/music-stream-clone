const Artist = require('../src/modules/artists/artist.model');

const artistsData = [
    {
        name: 'Luna Eclipse',
        bio: 'Electronic music producer and vocalist known for ambient soundscapes.',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        genres: ['Electronic', 'Ambient'],
        status: 'active'
    },
    {
        name: 'Neon Waves',
        bio: 'Pioneers of the modern synthwave movement with retro-futuristic vibes.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
        genres: ['Pop', 'Synthwave'],
        status: 'active'
    },
    {
        name: 'Velvet Skies',
        bio: 'A collective focused on smooth jazz and soul infusions.',
        image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
        genres: ['Jazz', 'Soul', 'R&B'],
        status: 'active'
    },
    {
        name: 'Solaris Duo',
        bio: 'Acoustic folk duo with harmonized vocals and deep storytelling.',
        image: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop',
        genres: ['Folk', 'Acoustic'],
        status: 'active'
    },
    {
        name: 'Digital Rain',
        bio: 'High-energy industrial and techno producer from Berlin.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
        genres: ['Techno', 'Industrial'],
        status: 'active'
    },
    {
        name: 'Ocean Drive',
        bio: 'Breezy tropical house perfect for summer parties.',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=400&fit=crop',
        genres: ['House', 'Tropical'],
        status: 'active'
    }
];

const seedArtists = async () => {
    try {
        const deleted = await Artist.deleteMany({});
        console.log(`- Cleared ${deleted.deletedCount} artists.`);
        const inserted = await Artist.insertMany(artistsData);
        console.log(`- Inserted ${inserted.length} artists.`);
        return inserted;
    } catch (error) {
        console.error('Error seeding artists:', error);
        throw error;
    }
};

module.exports = seedArtists;

if (require.main === module) {
    require('dotenv').config({ path: './backend/.env' });
    const connectDB = require('../src/config/db');
    const mongoose = require('mongoose');

    const run = async () => {
        await connectDB();
        await seedArtists();
        await mongoose.disconnect();
    };
    run();
}
