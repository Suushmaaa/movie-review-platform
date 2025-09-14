const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    reviewText: {
        type: String,
        required: [true, 'Review text is required'],
        trim: true,
        minlength: [10, 'Review must be at least 10 characters'],
        maxlength: [2000, 'Review cannot exceed 2000 characters']
    },
    helpful: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    reported: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure one review per user per movie
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

// Update movie average rating after review save/update/delete
reviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.movie);
});

reviewSchema.post('remove', async function() {
    await this.constructor.calculateAverageRating(this.movie);
});

reviewSchema.statics.calculateAverageRating = async function(movieId) {
    const Movie = mongoose.model('Movie');
    
    const stats = await this.aggregate([
        { $match: { movie: movieId } },
        {
            $group: {
                _id: '$movie',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Movie.findByIdAndUpdate(movieId, {
            averageRating: Math.round(stats[0].averageRating * 10) / 10,
            totalReviews: stats[0].totalReviews
        });
    } else {
        await Movie.findByIdAndUpdate(movieId, {
            averageRating: 0,
            totalReviews: 0
        });
    }
};

module.exports = mongoose.model('Review', reviewSchema);