const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json()); // Enable JSON body parsing
app.use(cors());         // Enable CORS
app.use(morgan('dev'));  // Use morgan logger in 'dev' format
app.use('/uploads', express.static('uploads')); // Serve static files from uploads directory

// Routes
app.use('/', require('./routes')); // Mount the routes

// Error handling middleware (MUST be last)
app.use(require('./middlewares/error.middleware'));

module.exports = app;
