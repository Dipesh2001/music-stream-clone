const express = require('express');
const searchController = require('./search.controller');

const router = express.Router();

// Search route (public)
router.get('/', searchController.search);

module.exports = router;
