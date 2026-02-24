require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

// Import individual seeds
const seedArtists = require('./seedArtists');
const seedAlbums = require('./seedAlbums');
const { seedTracks } = require('./seedTracks');
const seedPlaylists = require('./seedPlaylists');
const seedUsers = require('./seedUsers');

const seedAll = async () => {
    try {
        console.log('--- Database Seeding Started ---');

        await connectDB();

        console.log('Clearing database...');
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
        console.log('Database cleared.');

        console.log('1. Seeding Users...');
        await seedUsers();

        console.log('2. Seeding Artists...');
        const artists = await seedArtists();

        console.log('3. Seeding Albums...');
        const albums = await seedAlbums(artists);

        console.log('4. Seeding Tracks...');
        const tracks = await seedTracks(albums);

        console.log('5. Seeding Playlists...');
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
