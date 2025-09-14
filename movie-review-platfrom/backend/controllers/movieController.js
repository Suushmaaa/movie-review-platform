const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
const getMovies = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            genre,
            year,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (genre) {
            query.genres = { $in: [genre] };
        }

        if (year) {
            query.releaseYear = parseInt(year);
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const movies = await Movie.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Movie.countDocuments(query);

        res.json({
            success: true,
            data: movies,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
const getMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.json({
            success: true,
            data: movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create movie
// @route   POST /api/movies
const createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);

        res.status(201).json({
            success: true,
            data: movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get featured movies
// @route   GET /api/movies/featured
const getFeaturedMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ featured: true })
            .limit(6)
            .sort({ averageRating: -1 });

        res.json({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get trending movies
// @route   GET /api/movies/trending
const getTrendingMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ trending: true })
            .limit(6)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: movies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getMovies,
    getMovie,
    createMovie,
    getFeaturedMovies,
    getTrendingMovies
};