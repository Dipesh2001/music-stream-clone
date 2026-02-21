require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

// Import individual seeds
const seedArtists = require('./seedArtists');
const seedAlbums = require('./seedAlbums');
const { seedTracks } = require('./seedTracks');
const seedPlaylists = require('./seedPlaylists');

const seedAll = async () => {
    try {
        console.log('--- Database Seeding Started ---');

        await connectDB();

        console.log('1. Seeding Artists...');
        const artists = await seedArtists();

        console.log('2. Seeding Albums...');
        const albums = await seedAlbums(artists);

        console.log('3. Seeding Tracks...');
        const tracks = await seedTracks(albums);

        console.log('4. Seeding Playlists...');
        await seedPlaylists(tracks);

        console.log('--- Database Seeding Completed Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('--- Database Seeding Failed ---');
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

seedAll();
