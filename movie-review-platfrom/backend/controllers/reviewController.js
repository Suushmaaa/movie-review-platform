const Review = require('../models/Review');
const Movie = require('../models/Movie');

// @desc    Get reviews for a specific movie
// @route   GET /api/reviews/movie/:movieId
const getMovieReviews = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { 
            page = 1, 
            limit = 10, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;

        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const reviews = await Review.find({ 
            movie: movieId,
            isActive: true 
        })
        .populate('user', 'username profilePicture')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Review.countDocuments({ 
            movie: movieId,
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

// @desc    Create a new review
// @route   POST /api/reviews/movie/:movieId
const createReview = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { rating, reviewText, title, spoilers } = req.body;

        // Check if movie exists
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // Check if user already reviewed this movie
        const existingReview = await Review.findOne({
            user: req.user._id,
            movie: movieId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this movie'
            });
        }

        const review = await Review.create({
            user: req.user._id,
            movie: movieId,
            rating,
            reviewText,
            title,
            spoilers: spoilers || false
        });

        await review.populate('user', 'username profilePicture');

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get a specific review
// @route   GET /api/reviews/:id
const getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'username profilePicture')
            .populate('movie', 'title posterUrl');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this review'
            });
        }

        const { rating, reviewText, title, spoilers } = req.body;

        review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                rating,
                reviewText,
                title,
                spoilers
            },
            { new: true, runValidators: true }
        ).populate('user', 'username profilePicture');

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review or is admin
        if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this review'
            });
        }

        await Review.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Mark review as helpful/not helpful
// @route   POST /api/reviews/:id/helpful
const markHelpful = async (req, res) => {
    try {
        const { helpful } = req.body; // true for helpful, false for not helpful
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const userId = req.user._id;

        if (helpful) {
            // Remove from notHelpful if exists, add to helpful
            review.notHelpfulBy.pull(userId);
            if (!review.helpfulBy.includes(userId)) {
                review.helpfulBy.push(userId);
            }
        } else {
            // Remove from helpful if exists, add to notHelpful
            review.helpfulBy.pull(userId);
            if (!review.notHelpfulBy.includes(userId)) {
                review.notHelpfulBy.push(userId);
            }
        }

        review.helpful = review.helpfulBy.length;
        review.notHelpful = review.notHelpfulBy.length;

        await review.save();

        res.json({
            success: true,
            data: {
                helpful: review.helpful,
                notHelpful: review.notHelpful
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

module.exports = {
    getMovieReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
    markHelpful
};