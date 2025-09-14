const User = require('../models/User');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');

// @desc    Get user profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('reviews')
            .populate('watchlist');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user stats
        const reviewCount = await Review.countDocuments({ 
            user: user._id,
            isActive: true 
        });
        
        const watchlistCount = await Watchlist.countDocuments({ user: user._id });

        const userProfile = {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            favoriteGenres: user.favoriteGenres,
            joinDate: user.joinDate,
            reviewCount,
            watchlistCount,
            followers: user.followers?.length || 0,
            following: user.following?.length || 0
        };

        res.json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
const updateUserProfile = async (req, res) => {
    try {
        // Check if user is updating their own profile
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile'
            });
        }

        const { username, bio, profilePicture, favoriteGenres } = req.body;

        // Check if username is already taken
        if (username) {
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: req.user._id } 
            });
            
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is already taken'
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                username,
                bio,
                profilePicture,
                favoriteGenres
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user's watchlist
// @route   GET /api/users/:id/watchlist
const getUserWatchlist = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category = 'all' 
        } = req.query;

        let query = { user: req.params.id };
        
        if (category !== 'all') {
            query.category = category;
        }

        const watchlist = await Watchlist.find(query)
            .populate('movie', 'title posterUrl releaseYear genre averageRating')
            .sort({ dateAdded: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Watchlist.countDocuments(query);

        res.json({
            success: true,
            data: watchlist,
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

// @desc    Add movie to watchlist
// @route   POST /api/users/:id/watchlist
const addToWatchlist = async (req, res) => {
    try {
        // Check if user is adding to their own watchlist
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this watchlist'
            });
        }

        const { movieId, priority, notes, category } = req.body;

        // Check if movie is already in watchlist
        const existingEntry = await Watchlist.findOne({
            user: req.user._id,
            movie: movieId
        });

        if (existingEntry) {
            return res.status(400).json({
                success: false,
                message: 'Movie is already in your watchlist'
            });
        }

        const watchlistEntry = await Watchlist.create({
            user: req.user._id,
            movie: movieId,
            priority: priority || 'medium',
            notes,
            category: category || 'want-to-watch'
        });

        await watchlistEntry.populate('movie', 'title posterUrl releaseYear genre averageRating');

        res.status(201).json({
            success: true,
            data: watchlistEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/:id/watchlist/:movieId
const removeFromWatchlist = async (req, res) => {
    try {
        // Check if user is removing from their own watchlist
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this watchlist'
            });
        }

        const watchlistEntry = await Watchlist.findOneAndDelete({
            user: req.user._id,
            movie: req.params.movieId
        });

        if (!watchlistEntry) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found in watchlist'
            });
        }

        res.json({
            success: true,
            message: 'Movie removed from watchlist'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get user's reviews
// @route   GET /api/users/:id/reviews
const getUserReviews = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const reviews = await Review.find({ 
            user: req.params.id,
            isActive: true 
        })
        .populate('movie', 'title posterUrl releaseYear')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Review.countDocuments({ 
            user: req.params.id,
            isActive: true 
        });

        res.json({
            success: true,
            data: reviews,
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

// @desc    Update watchlist entry
// @route   PUT /api/users/:id/watchlist/:movieId
const updateWatchlistEntry = async (req, res) => {
    try {
        // Check if user is updating their own watchlist
        if (req.params.id !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this watchlist'
            });
        }

        const { priority, notes, category, watched } = req.body;

        const watchlistEntry = await Watchlist.findOneAndUpdate(
            {
                user: req.user._id,
                movie: req.params.movieId
            },
            {
                priority,
                notes,
                category,
                watched
            },
            { new: true, runValidators: true }
        ).populate('movie', 'title posterUrl releaseYear genre averageRating');

        if (!watchlistEntry) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found in watchlist'
            });
        }

        res.json({
            success: true,
            data: watchlistEntry
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getUserReviews,
    updateWatchlistEntry
};