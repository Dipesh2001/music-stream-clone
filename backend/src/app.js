const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json()); // Enable JSON body parsing
app.use(cors({
    origin: function (origin, callback) { callback(null, true); },
    credentials: true
}));         // Enable CORS
app.use(cookieParser());
app.use(morgan('dev'));  // Use morgan logger in 'dev' format
app.use('/uploads', express.static('uploads')); // Serve static files from uploads directory

// Routes
app.use('/', require('./routes')); // Mount the routes

// Error handling middleware (MUST be last)
app.use(require('./middlewares/error.middleware'));

module.exports = app;
