// scripts/seed-artists.js
// Run this script to clear all existing artists and seed 50 new dummy artists.
// Usage: node scripts/seed-artists.js

// require('dotenv').config({ path: '../.env' }); // Adjust path to your .env file
const mongoose = require('mongoose');
const Artist = require('../src/modules/artists/artist.model'); // Adjust path to your Artist model

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const dummyArtistNames = [
  "The Lumineers", "Taylor Swift", "Ed Sheeran", "Billie Eilish", "Khalid",
  "Dua Lipa", "Post Malone", "Ariana Grande", "The Weeknd", "Doja Cat",
  "Harry Styles", "Olivia Rodrigo", "Bad Bunny", "BTS", "BLACKPINK",
  "Coldplay", "Imagine Dragons", "Adele", "Bruno Mars", "Justin Bieber",
  "Rihanna", "Drake", "Beyoncé", "Lady Gaga", "Eminem",
  "Queen", "Michael Jackson", "Madonna", "Elvis Presley", "The Beatles",
  "Bob Dylan", "Pink Floyd", "Led Zeppelin", "Metallica", "AC/DC",
  "U2", "Red Hot Chili Peppers", "Green Day", "Linkin Park", "Nirvana",
  "Daft Punk", "Marshmello", "Calvin Harris", "David Guetta", "Tiësto",
  "Armin van Buuren", "Skrillex", "Deadmau5", "Avicii", "Kygo"
];

const dummyGenres = [
  "Pop", "Rock", "Hip Hop", "R&B", "Electronic", "Country", "Jazz",
  "Blues", "Classical", "Reggae", "Folk", "Indie", "Alternative", "Metal"
];

const generateRandomArtist = (index) => {
  const name = dummyArtistNames[index % dummyArtistNames.length];
  const bio = `A dummy bio for ${name}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;
  const image = `https://picsum.photos/seed/${name.replace(/\s/g, '')}/200/200`; // Unique image per name
  const numGenres = Math.floor(Math.random() * 3) + 1; // 1 to 3 genres
  const genres = [];
  for (let i = 0; i < numGenres; i++) {
    let randomGenre = dummyGenres[Math.floor(Math.random() * dummyGenres.length)];
    while (genres.includes(randomGenre)) { // Avoid duplicate genres for one artist
      randomGenre = dummyGenres[Math.floor(Math.random() * dummyGenres.length)];
    }
    genres.push(randomGenre);
  }
  const status = Math.random() < 0.8 ? 'active' : 'inactive'; // 80% active, 20% inactive

  return { name, bio, image, genres, status };
};

const seedArtists = async () => {
  await connectDB();
  console.log('Starting artist seeding process...');

  try {
    // Clear existing artists
    const deleteResult = await Artist.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing artists.`);

    const artistsToInsert = [];
    for (let i = 0; i < 50; i++) {
      artistsToInsert.push(generateRandomArtist(i));
    }

    const insertResult = await Artist.insertMany(artistsToInsert);
    console.log(`Successfully inserted ${insertResult.length} dummy artists.`);

  } catch (error) {
    console.error('Error during artist seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedArtists();
