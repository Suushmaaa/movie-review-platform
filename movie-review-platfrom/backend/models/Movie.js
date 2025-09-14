const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Movie title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    overview: {
        type: String,
        required: [true, 'Movie overview is required'],
        maxlength: [2000, 'Overview cannot exceed 2000 characters']
    },
    genres: [{
        type: String,
        required: true
    }],
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required'],
        min: [1900, 'Release year must be after 1900'],
        max: [new Date().getFullYear() + 10, 'Release year cannot be too far in the future']
    },
    director: {
        type: String,
        required: [true, 'Director is required'],
        maxlength: [100, 'Director name cannot exceed 100 characters']
    },
    cast: [{
        name: {
            type: String,
            required: true,
            maxlength: [100, 'Cast member name cannot exceed 100 characters']
        },
        character: {
            type: String,
            maxlength: [100, 'Character name cannot exceed 100 characters']
        }
    }],
    runtime: {
        type: Number,
        min: [1, 'Runtime must be at least 1 minute']
    },
    posterUrl: {
        type: String,
        default: 'default-poster.jpg'
    },
    backdropUrl: {
        type: String
    },
    trailerUrl: {
        type: String
    },
    tmdbId: {
        type: Number,
        unique: true,
        sparse: true
    },
    averageRating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    trending: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for search functionality
movieSchema.index({ title: 'text', overview: 'text', genres: 'text', director: 'text' });
movieSchema.index({ genres: 1 });
movieSchema.index({ releaseYear: 1 });
movieSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Movie', movieSchema);