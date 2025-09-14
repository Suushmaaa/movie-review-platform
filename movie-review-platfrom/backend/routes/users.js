const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    getUserWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getUserReviews,
    updateWatchlistEntry
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { validateProfileUpdate, validateWatchlist, validateObjectId } = require('../middleware/validation');

const router = express.Router();

router.get('/:id', validateObjectId('id'), getUserProfile);
router.put('/:id', auth, validateObjectId('id'), validateProfileUpdate, updateUserProfile);
router.get('/:id/watchlist', auth, validateObjectId('id'), getUserWatchlist);
router.post('/:id/watchlist', auth, validateObjectId('id'), validateWatchlist, addToWatchlist);
router.delete('/:id/watchlist/:movieId', auth, validateObjectId('id'), validateObjectId('movieId'), removeFromWatchlist);
router.get('/:id/reviews', validateObjectId('id'), getUserReviews);
router.put('/:id/watchlist/:movieId', auth, validateObjectId('id'), validateObjectId('movieId'), updateWatchlistEntry);

module.exports = router;