const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
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
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['want_to_watch', 'watching', 'watched'],
        default: 'want_to_watch'
    }
}, {
    timestamps: true
});

// Prevent duplicate entries
watchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);