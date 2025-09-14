const express = require('express');
const {
    getMovieReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
    markHelpful
} = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');
const { validateReview, validateObjectId } = require('../middleware/validation');

const router = express.Router();

router.get('/movie/:movieId', validateObjectId('movieId'), getMovieReviews);
router.post('/movie/:movieId', auth, validateObjectId('movieId'), validateReview, createReview);
router.get('/:id', validateObjectId('id'), getReview);
router.put('/:id', auth, validateObjectId('id'), validateReview, updateReview);
router.delete('/:id', auth, validateObjectId('id'), deleteReview);
router.post('/:id/helpful', auth, validateObjectId('id'), markHelpful);

module.exports = router;