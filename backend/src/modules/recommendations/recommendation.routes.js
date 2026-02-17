const express = require('express');
const recommendationController = require('./recommendation.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

// Recommendation routes require authentication
router.get('/', authMiddleware, recommendationController.getRecommendations);

module.exports = router;
