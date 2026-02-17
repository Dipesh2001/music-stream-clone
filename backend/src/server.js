require('dotenv').config(); // Load environment variables from .env file immediately

const app = require('../src/app'); // Adjust path as server.js is in src/
const { PORT } = require('./config/env');
const connectDB = require('./config/db');

// Connect to the database
connectDB();

const port = PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
