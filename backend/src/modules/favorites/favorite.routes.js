const express = require('express');
const favoriteController = require('./favorite.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = express.Router();

// All favorite routes require authentication
router.use(authMiddleware);

router.post('/tracks/:trackId', favoriteController.likeTrack);
router.delete('/tracks/:trackId', favoriteController.unlikeTrack);

router.post('/albums/:albumId', favoriteController.likeAlbum);
router.delete('/albums/:albumId', favoriteController.unlikeAlbum);

router.get('/me', favoriteController.myFavorites);

module.exports = router;
