
const express = require('express');
const {
    getMovies,
    getMovie,
    createMovie,
    getFeaturedMovies,
    getTrendingMovies
} = require('../controllers/movieController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getMovies);
router.get('/featured', getFeaturedMovies);
router.get('/trending', getTrendingMovies);
router.get('/:id', getMovie);
router.post('/', auth, adminAuth, createMovie);

module.exports = router;